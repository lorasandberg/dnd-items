

// Save the current set into a json file.
export const saveToJSON = (data: any) => {
    const a = document.createElement("a");
    const file = new Blob([JSON.stringify(data)], { type: "text/json" });
    a.href = URL.createObjectURL(file);
    a.download = "DnD Items.json";
    a.click();
}

export const loadFromJSON = (file : Blob) => {
    return new Promise((resolve, reject) => {
        if (file == null)
            return;
        let reader = new FileReader();
        reader.onloadend = function () {
            resolve(JSON.parse(reader.result as string));
        }
        reader.readAsText(file);
    });
}