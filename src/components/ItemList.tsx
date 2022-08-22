import { useEffect, useState } from 'react';
import SelectWithAdd from './selectWithAdd';


const ItemList = (props: any) => {

    const data = () => props.data;
    const campaigns = () => data().campaigns;
    const items = () => data().items;
    const currentCampaign = () => campaigns()[props.currentCampaignIndex];
    const [editable, setEditable] = useState<number>(-1);
    const filter = (item: any) => props.filter(item);
    const types = () => props.types;
    const rarities = () => props.rarities;
    const updateItem = props.updateItem;


    return (
        <>
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
                        <th>Location in '{data() && campaigns() && currentCampaign().Name}'</th>
                        <th></th>
                    </tr>
                </thead>


                {/* List all items */}
                <tbody>
                    {(data() && items().map((row: any) => {

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
                                        <td>{currentCampaign().items[row.ID]?.Location}</td>
                                        <td><button onClick={() => { setEditable(row.ID); }}>Edit</button></td>
                                    </tr>
                                )}

                                {/* Editable version of the item entry */}
                                {(editable == row.ID &&
                                    <tr key={row.ID}>
                                        <td style={{ backgroundColor: "hsl(" + row.Hue + "deg, 80%, 60%)" }}> </td>
                                        <td><input type="text" value={row.Name} onChange={(e) => { updateItem(row.ID, "Name", e.target.value); }}></input></td>
                                        <td>
                                            <SelectWithAdd options={types()} selected={row.Type} onChange={(e: any) => { updateItem(row.ID, "Type", e.target.value); }}></SelectWithAdd>
                                        </td>
                                        <td>
                                            <SelectWithAdd options={rarities()} selected={row.Rarity} onChange={(e: any) => { updateItem(row.ID, "Rarity", e.target.value); }}></SelectWithAdd>
                                        </td>
                                        <td><input type="text" value={row.Price} onChange={(e) => { updateItem(row.ID, "Price", e.target.value); }}></input></td>
                                        <td><input type="text" value={row.Type2} onChange={(e) => { updateItem(row.ID, "Type2", e.target.value); }}></input></td>
                                        <td className="description"><textarea rows={8}>{row.Description}</textarea></td>
                                        <td><input type="text" value={currentCampaign().items[row.ID]?.Location}></input></td>
                                        <td><button onClick={() => { setEditable(-1); }}>Close</button></td>
                                    </tr>
                                )}

                            </>
                        )
                    }))}
                </tbody>
            </table>
        </>);
}

export default ItemList;