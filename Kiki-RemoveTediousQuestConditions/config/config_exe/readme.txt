Simple dynamic Json UI interface using custom tkInter.
Install latest python and pip. Then

pip install customtkinter
pip install pyinstaller

To build
cd path\to\your\script
pyinstaller --onefile --noconsole config.py

To test before building you will need to change the config_dir path to point to where your config is located at the editing point.  
When distributing you will want to send the config by itself in the same folder as the config.json.
In this case edit it to "./config.py"