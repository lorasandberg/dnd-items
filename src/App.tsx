import React, { useEffect } from 'react';
import './App.css';
import { useState } from 'react';
import { saveToJSON, loadFromJSON } from './components/fileIO';
import SelectWithAdd from "./components/selectWithAdd";

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
  const [rarities, setRarities] = useState<any>({}); // MVP filtering feature
  const [editable, setEditable] = useState<Number>(-1); // Which entry is currently editable

  // Load data file
  const loadFile = (e: any) => {
    loadFromJSON(e)
      .then(obj => {
        setData(obj);
      })
  }

  // Get all unique rarities across items
  const getRarities = () => {
    if (data === null)
      return [];

    let r: any[] = [];

    for (let i = 0; i < data.items.length; i++) {
      if (!r.includes(data.items[i].Rarity))
        r.push(data.items[i].Rarity);
    }
    return r;
  }

  // Get all unique types across items
  const getTypes = () => {
    if (data === null)
      return [];

    let r: any[] = [];

    for (let i = 0; i < data.items.length; i++) {
      if (!r.includes(data.items[i].Type))
        r.push(data.items[i].Type);
    }

    r.sort();
    return r;
  }

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
    let campaign = { ID: getNewCampaignID(), Name: name };
    newData.campaigns.push(campaign);
    setData(newData);

  }

  // Check if item should be displayed in the list or not, considering currently used filters.
  const filter = (item: any) => {

    let r: string = item.Rarity;
    if (rarities[r])
      return false;

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

  return (
    <div className="App">
      <button onClick={() => saveToJSON(data)}>Save</button>
      <input type="file" onChange={loadFile}></input>
      <p><input type="text" value={newCampaignName} onChange={(e: any) => setNewCampaignName(e.target.value)}></input> <button onClick={() => addCampaign(newCampaignName)}>Add campaign</button></p>

      {/* List campaigns */}
      {(data && data.campaigns.map((campaign: any, index: number) => {
        return (
          <button key={campaign.ID} onClick={() => setCurrentCampaign(index)}>{campaign.Name}</button>
        );
      }))}
      {/* MVP filtering feature */}
      <p>
        {(getRarities()!.map((rarity: string) => {
          return (
            <button style={{ fontWeight: (rarities[rarity] ? "normal" : "bold") }} key={rarity} onClick={() => {
              let r = shallow(rarities);
              r[rarity] = !r[rarity];
              setRarities(r);
            }}>{rarity}</button>
          );
        }))}
      </p>


      {/* Table headers */}
      <table cellSpacing={0}>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Type</th>
            <th>Rarity</th>
            <th>Price</th>
            <th>???</th>
            <th>Description</th>
            <th>Location in '{data && data.campaigns && data.campaigns[currentCampaign].Name}'</th>
            <th></th>
          </tr>
        </thead>


        {/* List all items */}
        <tbody>
          {(data && data.items.map((row: any) => {

            // To show or not to show
            if (!filter(row))
              return;

            return (
              <>

              {/* Default view of the item entry */}
              {(editable != row.ID &&
                <tr key={row.ID}>
                  <td style={{ backgroundColor: "hsl(" + row.Hue + "deg, 80%, 60%)" }}> </td>
                  <td>{row.Name}</td>
                  <td>{row.Type}</td>
                  <td>{row.Rarity}</td>
                  <td>{row.Price}</td>
                  <td>{row.Type2}</td>
                  <td className="description"><div>{row.Description}</div></td>
                  <td>{data.campaigns[currentCampaign].items[row.ID].Location}</td>
                  <td><button onClick={() => { setEditable(row.ID); }}>Edit</button></td>
                </tr>
              )}

                {/* Editable version of the item entry */}
                {(editable == row.ID &&
                  <tr key={row.ID}>
                    <td style={{ backgroundColor: "hsl(" + row.Hue + "deg, 80%, 60%)" }}> </td>
                    <td><input type="text" value={row.Name} onChange={(e) => { updateItem(row.ID, "Name", e.target.value); }}></input></td>
                    <td>
                      <SelectWithAdd options={getTypes()} selected={row.Type} onChange={(e: any) => { updateItem(row.ID, "Type", e.target.value); }}></SelectWithAdd>
                    </td>
                    <td>
                      <SelectWithAdd options={getRarities()} selected={row.Rarity} onChange={(e: any) => { updateItem(row.ID, "Rarity", e.target.value); }}></SelectWithAdd>
                    </td>
                    <td><input type="text" value={row.Price} onChange={(e) => { updateItem(row.ID, "Price", e.target.value); }}></input></td>
                    <td><input type="text" value={row.Type2} onChange={(e) => { updateItem(row.ID, "Type2", e.target.value); }}></input></td>
                    <td className="description"><textarea rows={8}>{row.Description}</textarea></td>
                    <td><input type="text" value={data.campaigns[currentCampaign].items[row.ID].Location}></input></td>
                    <td><button onClick={() => { setEditable(-1); }}>Close</button></td>
                  </tr>
                )}

              </>
            )
          }))}
        </tbody>
      </table>
    </div>
  );


}

export default App;
