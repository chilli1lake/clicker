#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: "Test the Life Tycoon Clicker game at https://clickmogul.preview.emergentagent.com - comprehensive UI/UX testing of all game sections including clicker, auction, business, investment, achievements, store, leaderboard, prestige, and mobile navigation"

frontend:
  - task: "Clicker Section - Main CLICK button functionality"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/components/game/ClickerSection.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "testing"
        comment: "Initial testing required - need to verify click button increases money, floating coins animation, and stats display"

  - task: "Auction System - Start auction and bidding"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/components/game/AuctionSection.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "testing"
        comment: "Initial testing required - need to verify auction start, item display with rarity badges, timer countdown, and bidding functionality"

  - task: "Business Section - Display and purchasing"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/components/game/BusinessSection.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "testing"
        comment: "Initial testing required - need to verify business list display, locked/unlocked status, pricing, and purchase functionality"

  - task: "Investment Section - Stocks and Crypto trading"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/components/game/InvestmentSection.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "testing"
        comment: "Initial testing required - need to verify stocks and crypto display, prices, buy/sell buttons functionality"

  - task: "Achievements Section - Progress display"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/components/game/AchievementsSection.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "testing"
        comment: "Initial testing required - need to verify achievements display with progress bars and challenge tabs"

  - task: "Store Section - Premium items display"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/components/game/PremiumStoreSection.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "testing"
        comment: "Initial testing required - need to verify premium items and cosmetics display with pricing"

  - task: "Leaderboard Section - Player rankings"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/components/game/LeaderboardSection.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "testing"
        comment: "Initial testing required - need to verify leaderboard display with different categories and player rankings"

  - task: "Prestige Section - Status and progress"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/components/game/PrestigeSection.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "testing"
        comment: "Initial testing required - need to verify prestige status display and progress bars"

  - task: "Mobile Navigation - Sidebar functionality"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/pages/GamePage.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "testing"
        comment: "Initial testing required - need to verify mobile sidebar navigation works on different screen sizes"

  - task: "Header Stats - Money, XP, Level display"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/components/game/GameHeader.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "testing"
        comment: "Initial testing required - need to verify header displays money, XP, level, and passive income correctly"

metadata:
  created_by: "testing_agent"
  version: "1.0"
  test_sequence: 1
  run_ui: true

test_plan:
  current_focus:
    - "Clicker Section - Main CLICK button functionality"
    - "Auction System - Start auction and bidding"
    - "Business Section - Display and purchasing"
    - "Investment Section - Stocks and Crypto trading"
    - "Mobile Navigation - Sidebar functionality"
    - "Header Stats - Money, XP, Level display"
  stuck_tasks: []
  test_all: true
  test_priority: "high_first"

agent_communication:
  - agent: "testing"
    message: "Starting comprehensive UI/UX testing of Life Tycoon Clicker game. Will test all sections systematically starting with high priority items: clicker functionality, auction system, business section, investment section, mobile navigation, and header stats. Then proceed to medium priority items: achievements, store, leaderboard, and prestige sections."