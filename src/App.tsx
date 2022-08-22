import React, { useEffect } from 'react';
import './App.css';
import { useState } from 'react';
import { saveToJSON, loadFromJSON } from './components/fileIO';
import SelectWithAdd from "./components/selectWithAdd";
import ItemList from './components/ItemList';
import Dropzone from './dropzone';

/* TODO 
- ItemArray component
- Campaign managing view
- Sidebar
- All item fields editable
- Filtering options for Type, Rarity, Price?
- Search option by name
- Decide between list or card view?
- Dropzone component for data file
- Reminders to save the data every now and then
- Save data in localstorage?
- Undo?
*/

// Shallow copy 
function shallow(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

function App() {

  const [data, setData]: any = useState(null); // All data in form { items: [], campaigns: [] }
  const [newCampaignName, setNewCampaignName] = useState(""); // Add new campaign
  const [currentCampaign, setCurrentCampaign] = useState(0); // Currently selected campaign
  const [rarities, setRarities] = useState<string[]>([]); // MVP filtering feature
  const [editable, setEditable] = useState<Number>(-1); // Which entry is currently editable
  const [keyword, setKeyword] = useState<string>("");

  const getCurrentCampaign = () => data.campaigns[currentCampaign];

  const ready = () => data !== null;

  // Load data file
  const loadFile = (e: any) => {
    loadFromJSON(e)
      .then(obj => {
        setData(obj);
      })
  }

  useEffect(() => {
    const stored = localStorage.getItem("data");
    setData(JSON.parse(stored as string));
  }, []);

  useEffect(() => {
    if (data != null)
      localStorage.setItem("data", JSON.stringify(data));
  }, [data]);

  // Make sure that the filter array doesn't keep old removed values around.
  useEffect(() => {
    const all = getRarities();
    let newValues: string[] = [];
    for (let i = 0; i < rarities.length; i++) {
      if (all.includes(rarities[i]))
        newValues.push(rarities[i]);
    }

    if (rarities.length != newValues.length)
      setRarities(newValues);
  }, [rarities])

  // Get all unique field values across items
  const getFields = (field: string) => {
    if (data === null)
      return [];

    let r: any[] = [];

    for (let i = 0; i < data.items.length; i++) {
      if (!r.includes(data.items[i][field]))
        r.push(data.items[i][field]);
    }

    r.sort();
    return r;
  }

  // Get all unique types across items
  const getTypes = () => getFields("Type");

  // Get all unique rarities across items
  const getRarities = () => getFields("Rarity");

  // Generate unique campaign ID
  const getNewCampaignID = () => {
    let newID = 0;

    for (let i = 0; i < data.campaigns.length; i++) {
      if (data.campaigns[i].ID >= newID)
        newID = data.campaigns[i] + 1;
    }
    return newID;
  }

  // Add a new campaign
  const addCampaign = (name: string) => {
    console.log(name);
    let newData = shallow(data);
    let campaign = { ID: getNewCampaignID(), Name: name, items: [], campaigns: [] };
    newData.campaigns.push(campaign);
    setData(newData);

  }

  // Check if item should be displayed in the list or not, considering currently used filters.
  const filter = (item: any) => {

    if (rarities.length > 0) {
      if (!rarities.includes(item.Rarity))
        return false;
    }

    if (keyword != "") {
      if (item.Name.toLowerCase().indexOf(keyword.toLowerCase()) < 0)
        return false;
    }

    return true;
  }

  const updateItem = (id: number, field: string, value: any) => {
    let n = shallow(data);

    for (let i = 0; i < n.items.length; i++) {
      if (n.items[i].ID == id) {
        n.items[i][field] = value;
      }
    }

    setData(n);
  }

  const itemListProps = {
    data: data,
    currentCampaignIndex: currentCampaign,
    filter: filter,
    types: getFields("Type"),
    rarities: getFields("Rarity"),
    updateItem: updateItem
  }


  return (
    <div className="App">
      <aside id="sidebar">
        <h1>Campaign Item Manager</h1>
        <div className="save">
          {ready() && <button onClick={() => saveToJSON(data)}>Save</button>}
        </div>
        {ready() && <div id="campaigns">
          <h2>Campaigns</h2>
          {/* List campaigns */}
          <p>Currently selected campaign: {getCurrentCampaign().Name}</p>
          {(data && data.campaigns.map((campaign: any, index: number) => {
            return (
              <p><button key={campaign.ID} onClick={() => setCurrentCampaign(index)}>{campaign.Name}</button></p>
            );
          }))}
          <p><input type="text" value={newCampaignName} onChange={(e: any) => setNewCampaignName(e.target.value)}></input> <button onClick={() => addCampaign(newCampaignName)}>Add campaign</button></p>

        </div>}
      </aside>
      <main>

        {/* MVP filtering feature */}
        {ready() && (<>
          <p className="search"><input placeholder='search' type="text" value={keyword} onChange={(e) => { setKeyword(e.target.value) }}></input></p>
          <p>
            {(getRarities()!.map((rarity: string) => {
              return (
                <button style={{ fontWeight: (rarities.length == 0 || rarities.includes(rarity) ? "bold" : "normal") }} key={rarity} onClick={() => {
                  let r = shallow(rarities);
                  let i;
                  if (i = r.indexOf(rarity) >= 0)
                    r.splice(r, 1);
                  else {
                    r.push(rarity);
                  }
                  setRarities(r);
                }}>{rarity}</button>
              );
            }))}
          </p>
          <ItemList {...itemListProps} ></ItemList>
        </>)}

        {!ready() && (<>
          <Dropzone fileHandler={loadFile}>Drop your data file here</Dropzone>
        </>)}
      </main>
    </div>
  );


}

export default App;
