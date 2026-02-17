import os
import sys
import webbrowser
import threading
import time
import shutil  # <--- Added for copying files
from waitress import serve
from inventory_system.wsgi import application

def open_browser():
    """Wait 1.5 seconds then launch browser"""
    time.sleep(1.5)
    webbrowser.open('http://localhost:8000')

def initialize_database():
    """Extract db.sqlite3 from the EXE to the folder if it's missing"""
    if getattr(sys, 'frozen', False):
        base_dir = os.path.dirname(sys.executable) # Folder where EXE is
        internal_db = os.path.join(sys._MEIPASS, 'db.sqlite3') # DB inside EXE
        external_db = os.path.join(base_dir, 'db.sqlite3') # DB on Disk

        if not os.path.exists(external_db):
            print(f">> First run detected. Extracting database to {external_db}...")
            try:
                shutil.copy2(internal_db, external_db)
                print(">> Database initialized successfully.")
            except Exception as e:
                print(f"!! Failed to extract database: {e}")

if __name__ == '__main__':
    try:
        # 1. Setup Environment
        if getattr(sys, 'frozen', False):
            # Fix for PyInstaller temp paths
            os.environ['DJANGO_SETTINGS_MODULE'] = 'inventory_system.settings'
        
        print("---------------------------------------")
        print("   ZENITH SYSTEM IS STARTING...        ")
        print("   Please wait...                      ")
        print("---------------------------------------")

        # 2. Extract Database if needed
        initialize_database()

        # 3. Launch Browser
        threading.Thread(target=open_browser).start()

        # 4. Start Server
        print(">> Server running on http://localhost:8000")
        serve(application, host='0.0.0.0', port=8000, threads=4)

    except Exception as e:
        print("\n!!!!!!!!!!!!!! ERROR !!!!!!!!!!!!!!")
        print(f"Error: {e}")
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n")
        import traceback
        traceback.print_exc()
    
    finally:
        input("\nPress Enter to exit...")