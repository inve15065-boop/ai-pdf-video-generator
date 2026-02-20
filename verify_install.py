#!/usr/bin/env python3
"""
Installation Verification Script
Run this to check if all dependencies are installed correctly
"""

import sys

def check_python_version():
    """Check Python version"""
    version = sys.version_info
    if version.major >= 3 and version.minor >= 8:
        print(f"✅ Python {version.major}.{version.minor}.{version.micro} - OK")
        return True
    else:
        print(f"❌ Python {version.major}.{version.minor}.{version.micro} - Need 3.8+")
        return False

def check_packages():
    """Check if required packages are installed"""
    required_packages = [
        'flask',
        'flask_cors',
        'openai',
        'PyPDF2',
        'pdf2image',
        'moviepy',
        'PIL',
        'gtts',
        'requests',
        'dotenv'
    ]
    
    missing = []
    for package in required_packages:
        try:
            if package == 'PIL':
                __import__('PIL')
            elif package == 'dotenv':
                __import__('dotenv')
            else:
                __import__(package)
            print(f"✅ {package} - Installed")
        except ImportError:
            print(f"❌ {package} - Missing")
            missing.append(package)
    
    return len(missing) == 0, missing

def check_env_file():
    """Check if .env file exists"""
    import os
    if os.path.exists('.env'):
        print("✅ .env file - Found")
        return True
    else:
        print("⚠️  .env file - Not found (copy from .env.example)")
        return False

def main():
    print("=" * 50)
    print("🔍 AI PDF to Video Generator - Installation Check")
    print("=" * 50)
    print()
    
    all_good = True
    
    # Check Python version
    if not check_python_version():
        all_good = False
    print()
    
    # Check packages
    packages_ok, missing = check_packages()
    if not packages_ok:
        all_good = False
        print()
        print("Missing packages. Install with:")
        print("  pip install -r requirements.txt")
    print()
    
    # Check .env
    if not check_env_file():
        all_good = False
        print("Create .env file:")
        print("  copy .env.example .env    (Windows)")
        print("  cp .env.example .env      (Linux/Mac)")
    print()
    
    print("=" * 50)
    if all_good:
        print("✅ All checks passed! Ready to run.")
        print()
        print("Start the application:")
        print("  python app.py")
    else:
        print("❌ Some checks failed. Fix the issues above.")
    print("=" * 50)

if __name__ == '__main__':
    main()
