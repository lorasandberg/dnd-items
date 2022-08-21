import {useState, useRef} from 'react';

const ADD_NEW_VALUE_KEY = "ADD_NEW_VALUE_KEY";

// Select input field with an option to Add New item by writing the name manually.
const SelectWithAdd = (props: any) => {

    const [addNew, setAddNew] = useState(false);
    const textInput = useRef<HTMLInputElement>(null);

    const onChange = (e: any) => {

        if(e.target.value == ADD_NEW_VALUE_KEY){
            setAddNew(true);
            requestAnimationFrame(() => { textInput.current!.focus(); });
        }
        else {
            props.onChange(e);
        }
    }

    return (
        <>
            {(!addNew && <select onChange={onChange}>
                {props.options.map((option: any) => {
                    return <option selected={(props.selected == option)}>{option}</option>
                })}
                <option value={ADD_NEW_VALUE_KEY}>Add new...</option>
            </select>)}
            {(addNew && <input ref={textInput} type="text" onChange={props.onChange} value={props.selected}></input>)}
        </>
    )
}

export default SelectWithAdd;