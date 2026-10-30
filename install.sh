RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

echo ""
echo -e "${CYAN}${BOLD} =========================================${RESET}"
echo -e "${CYAN}${BOLD}   Adhyatma Manthan - macOS/Linux Setup${RESET}"
echo -e "${CYAN}${BOLD}   AI-Powered Spiritual Guidance Platform${RESET}"
echo -e "${CYAN}${BOLD} =========================================${RESET}"
echo ""


echo -e "${BOLD}[Step 1/4] Checking Python 3 installation...${RESET}"
echo ""

if command -v python3 &>/dev/null; then
    PYTHON_CMD="python3"
    PIP_CMD="pip3"
elif command -v python &>/dev/null; then
    # Check if this 'python' is version 3
    PY_VERSION=$(python --version 2>&1 | cut -d' ' -f2 | cut -d'.' -f1)
    if [ "$PY_VERSION" = "3" ]; then
        PYTHON_CMD="python"
        PIP_CMD="pip"
    else
        echo -e "${RED} ERROR: Python 3 is not installed.${RESET}"
        echo ""
        echo " Please install Python 3 using one of these methods:"
        echo ""
        echo "   Option A (Recommended - Official installer):"
        echo "     1. Go to https://www.python.org/downloads/"
        echo "     2. Download and install Python 3.x for macOS"
        echo "     3. Run this script again after installing"
        echo ""
        echo "   Option B (Homebrew):"
        echo "     brew install python"
        echo ""
        exit 1
    fi
else
    echo -e "${RED} ERROR: Python is not installed on this system.${RESET}"
    echo ""
    echo " Please install Python 3:"
    echo "   - Visit: https://www.python.org/downloads/"
    echo "   - Or run: brew install python  (if Homebrew is installed)"
    echo ""
    exit 1
fi

PY_VER=$($PYTHON_CMD --version 2>&1)
echo -e " ${GREEN}Found: $PY_VER${RESET}"
echo -e " Using command: ${YELLOW}$PYTHON_CMD${RESET}"
echo ""

echo -e "${BOLD}[Step 2/4] Checking pip (package installer)...${RESET}"
echo ""

if ! command -v $PIP_CMD &>/dev/null; then
    echo " pip not found. Trying to install pip..."
    $PYTHON_CMD -m ensurepip --upgrade 2>/dev/null
    $PYTHON_CMD -m pip install --upgrade pip 2>/dev/null
    PIP_CMD="$PYTHON_CMD -m pip"
fi

echo -e " ${GREEN}pip is ready.${RESET}"
echo ""


echo -e "${BOLD}[Step 3/4] Installing Flask (web framework)...${RESET}"
echo ""

$PIP_CMD install flask --quiet
if [ $? -ne 0 ]; then
    echo -e "${RED} ERROR: Failed to install Flask.${RESET}"
    echo ""
    echo " Possible reasons:"
    echo "   - No internet connection"
    echo "   - Permission issue (try running with sudo)"
    echo ""
    echo " You can try manually:"
    echo "   pip3 install flask"
    echo "   or: sudo pip3 install flask"
    echo ""
    exit 1
fi

echo -e " ${GREEN}Flask installed successfully!${RESET}"
echo ""

echo -e "${BOLD}[Step 4/4] Verifying installation...${RESET}"
echo ""

FLASK_VER=$($PYTHON_CMD -c "import flask; print(flask.__version__)" 2>&1)
if [ $? -ne 0 ]; then
    echo -e "${RED} ERROR: Flask verification failed.${RESET}"
    echo " Try running: pip3 install flask"
    exit 1
fi

echo -e " ${GREEN}Flask version: $FLASK_VER${RESET}"
echo ""
echo -e "${CYAN}${BOLD} =========================================${RESET}"
echo -e "${GREEN}${BOLD}   Installation Complete!${RESET}"
echo -e "${CYAN}${BOLD} =========================================${RESET}"
echo ""
echo -e " ${BOLD}Starting Adhyatma Manthan...${RESET}"
echo ""
echo -e " ${YELLOW}Open your browser and go to:${RESET}"
echo -e " ${BOLD}  http://localhost:5000${RESET}"
echo ""
echo " Press Ctrl+C in this Terminal to stop the server."
echo -e "${CYAN} ==========================================${RESET}"
echo ""

if [[ "$OSTYPE" == "darwin"* ]]; then
    (sleep 2 && open http://localhost:5000) &
fi

# Start the Flask app
$PYTHON_CMD app.py

echo ""
echo " The server has stopped."
