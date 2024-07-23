import customtkinter as ctk
from pathlib import Path
import json

ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("green")
app = ctk.CTk()
app.title("Remove Tedious Quest Conditions Config")
app.geometry("250x370")
config_dir = Path("config.json")

with config_dir.open('r') as file:
    data = json.load(file)

checkbox_vars = {}

for option in data:
    var = ctk.BooleanVar(value=data[option])
    checkbox_vars[option] = var
    checkbox = ctk.CTkCheckBox(app, text=option, variable=var)
    checkbox.pack(anchor=ctk.W)

def save_to_json():
    updated_data = {option: var.get() for option, var in checkbox_vars.items()}
    
    with config_dir.open('w') as file:
        json.dump(updated_data, file, indent=4)

save_button = ctk.CTkButton(app, text="Save", command=save_to_json, height=30)
save_button.pack(anchor=ctk.W, pady=10)

app.mainloop()