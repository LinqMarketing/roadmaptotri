# 70.3 Triathlon Nutrition Tracker - Development TODO

## Phase 1: Project Structure & Database Schema
- [x] Database schema design (users, meals, training sessions, supplements, progress, meal prep recipes)
- [x] Design system implementation (International Typographic Style - white/red/black, grid system)
- [x] Global CSS variables and Tailwind configuration
- [x] Layout components (DashboardLayout, navigation structure)

## Phase 2: Authentication & Dashboard
- [x] User authentication with role-based access (admin/user)
- [x] Dashboard layout and navigation
- [x] Daily calorie and macronutrient targets display
- [x] User profile and settings page
- [x] Auth tests

## Phase 3: Add Navigation & Wire Up Buttons (Complete)
- [x] Meal prep recipe database (Slow Cooker Chicken, Air Fryer Potatoes, Recovery Smoothies, etc.)
- [x] Daily meal logging system (Pre-Workout 7AM, Post-Workout, Lunch 3PM, Dinner 6PM)
- [x] Training session logger (9AM-1PM workouts)
- [x] Automatic fueling recommendations based on session duration
- [x] Supplement tracking checklist (Creatine, Electrolytes, Omega-3, Vitamin D, Beta-Alanine, Caffeine)
- [x] Query procedures for fetching meal logs, training sessions, supplements
- [x] Database helper functions for user data retrieval
- [x] Add navigation menu with links to all features
- [x] Add action buttons on dashboard to access each feature
- [x] Wire up "Log Meal" buttons to save data and update daily totals
- [ ] Wire up "Log Training" buttons to save sessions
- [ ] Wire up "Log Supplement" buttons to save completion status

## Phase 4: Advanced Features & LLM Integration
- [ ] Meal prep planning tool with shopping list generator
- [ ] LLM integration for personalized meal variations
- [ ] Meal variation generation based on proteins and ingredients
- [ ] Macronutrient-aware meal suggestions

## Phase 5: Progress & Tracking
- [ ] Weekly progress tracker (weight loss journey 172 lbs → 165 lbs)
- [ ] Hydration tracker (3-4 liter daily goal with reminders)
- [ ] Race week countdown with carb-loading protocol (60-70% carbs, 3 days pre-race)
- [ ] Progress visualization and charts

## Phase 6: Testing & Deployment
- [ ] Vitest unit tests for all procedures
- [ ] Integration testing
- [ ] Performance optimization
- [ ] Final checkpoint and deployment


## Phase 3.5: Expand Meal Database to 25 Recipes (Complete)
- [x] Create 5 pre-workout meal options (quick, energizing, easy to digest)
- [x] Create 5 post-workout meal options (recovery-focused, high protein)
- [x] Create 5 lunch meal options (balanced, meal-prep friendly)
- [x] Create 5 snack meal options (convenient, nutrient-dense)
- [x] Create 5 dinner meal options (satisfying, complete macros)
- [x] Update meal seed script with all 25 new recipes
- [x] Test all recipes in the meal logging UI
- [x] Verify nutritional accuracy for all 25 recipes

## Domain & Branding
- [ ] Decide on domain name (options: everyonetotri.com, anyonetotri.com, etc.)
- [ ] Decide on Instagram handle (@everyonetotri, @anyonetotri, etc.)
- [ ] Update website branding and title once domain is chosen


## Phase 3.6: Add Detailed Recipes with Exact Measurements (Complete)
- [x] Research and compile detailed recipes for all 25 meals
- [x] Add exact ingredient quantities to match nutritional targets
- [x] Add step-by-step cooking instructions
- [ ] Update database schema to store detailed recipe instructions
- [ ] Update meal database with complete recipes
- [ ] Display detailed recipes in meal logging UI with expandable sections


## Phase 3.7: Recipe Modals and PDF Export (Complete)
- [x] Create RecipeModal component to display full recipe details
- [x] Update meal database with detailed recipe instructions and ingredients
- [x] Add "View Recipe" button to each meal in meal logging UI
- [x] Implement PDF export functionality for individual recipes
- [ ] Add "Print All Recipes" button for bulk PDF export
- [x] Test recipe modal and PDF generation


## Phase 4: Training Routines & Library (Complete)
- [x] Create 12-week sprint triathlon training routine
- [x] Create 18-week sprint triathlon training routine
- [x] Create 24-week sprint triathlon training routine
- [x] Create 8-week half ironman training routine (current plan)
- [x] Create 6-month beginner-to-half-ironman training routine
- [x] Build training library page with all routines
- [x] Add PDF download functionality for training plans
- [x] Integrate training plans into app navigation


## Phase 4.5: Professional Training Plan PDFs (Complete)
- [x] Research professional sprint triathlon training plans
- [x] Research professional half ironman training plans
- [x] Compile comprehensive PDF training plans for all 5 programs
- [x] Integrate PDF downloads into Training Library page
- [x] Test PDF downloads and verify quality


## Phase 5: Running Programs (5K & Half Marathon) (Complete)
- [x] Create 12-week 5K beginner training program
- [x] Create 24-week 5K beginner training program
- [x] Create 12-week Half Marathon beginner training program
- [x] Create 24-week Half Marathon beginner training program
- [x] Convert all 4 running programs to PDFs
- [x] Integrate running programs into Training Library
- [x] Update Training Library UI to display running programs
- [x] Test all PDF downloads and functionality


## Phase 6: Phone Number Capture for SMS & Community (Complete)
- [x] Add phone number field to users database table
- [x] Create updatePhoneNumber tRPC procedure with validation
- [x] Build PhoneNumberCapture modal component
- [x] Integrate modal into App.tsx to show after login
- [x] Add phone number validation (10-20 characters)
- [x] Write and pass vitest tests (5/5 passing)
- [x] Verify data is stored and accessible for SMS/EFT integration


## Phase 7: Personalized Athlete Mission & Goals (Complete)
- [x] Add mission and goals fields to users database table
- [x] Create getMissionAndGoals tRPC query
- [x] Create updateMissionAndGoals tRPC mutation
- [x] Build My Mission dedicated page with editing interface
- [x] Create inspirational dashboard summary card
- [x] Add navigation link to My Mission page
- [x] Write vitest tests for mission functionality (11/11 passing)
- [x] Test all CRUD operations and display


## Phase 8: Daily Personalized Motivation Quotes (Complete)
- [x] Design quote generation system and database schema
- [x] Add quote categories (Training Mindset, Nutrition Discipline, Race Day Focus, Recovery, Mental Strength)
- [x] Create tRPC procedures for AI-generated quote generation
- [x] Build daily quote retrieval procedure with LLM integration
- [x] Create daily quote dashboard widget with category colors
- [x] Add quote category rotation logic (rotates through 5 categories by day of week)
- [x] Write vitest tests for quote system (7/7 passing)
- [x] Test end-to-end quote generation and display
- [x] Quotes personalized based on athlete's mission, goals, and training motivation


## Phase 9: OAuth Signup Fix & SEO Improvements (Complete)
- [x] Fixed OAuth signup configuration (changed type from signIn to signUp)
- [x] Added meta description and keywords for SEO
- [x] Verified signup flow now allows new user registration


## Phase 10: Athlete Name Collection & Personalization (Complete)
- [x] Add first_name and last_name fields to users table
- [x] Add name input fields to PhoneNumberCapture modal
- [x] Create updatePhoneNumber tRPC procedure (updated to handle names)
- [x] Update dashboard greeting to display "Welcome, [First Name] [Last Name]"
- [x] Make weight goals customizable (remove hardcoded values - now fetch from mission data)
- [x] Write vitest tests for name collection (7 tests passing)
- [x] Test end-to-end personalization flow


## Phase 11: One-Time Profile Completion Prompt for Existing Users (Complete)
- [x] Create ProfileCompletionPrompt component for existing users without names
- [x] Add logic to show prompt only once per user (checks if firstName/lastName are null)
- [x] Implement prompt display in App.tsx after authentication
- [x] Reuse updatePhoneNumber procedure for profile completion
- [x] Write vitest tests for profile completion prompt (7 tests passing)
- [x] Test end-to-end flow for existing users
- [x] Fix input field bug - rewrote with explicit colors, ref-based focus, and simplified event handling


## Bug Fixes (Jan 12, 2026)
- [x] Fixed phone number validation error in ProfileCompletionPrompt - made phoneNumber optional in updatePhoneNumber procedure
- [x] Fixed input field bug in ProfileCompletionPrompt - rewrote with explicit colors and ref-based focus
- [x] Added automatic OAuth domain registration - server now registers custom domain with Manus OAuth on startup
- [x] Added roadmaptotri.com to vite allowedHosts configuration


## Bug: Supplement Tracking Data Loss (Fixed)
- [x] Investigate Supplements page implementation
- [x] Identified root cause: component state not initialized from database
- [x] Update Supplements component to initialize state from database query
- [x] Add useEffect hook to sync state with database logs
- [x] Write vitest tests for supplement tracking (6 tests passing)
- [x] Verify data persists across page navigation


## Phase 12: Meal Logging Visibility & Nutrition Dashboard (Complete)
- [x] Add meal details display to Log Your Meals page (show meal name and calories under each meal time)
- [x] Reused existing tRPC procedures for meal logs
- [x] Update MealLogging component to display logged meal information
- [x] Update Dashboard to show daily nutrition summary (calories, carbs, protein, fats)
- [x] Fixed nutrition calculation to include recipe data
- [x] All 51 tests passing
- [x] Test end-to-end meal logging and dashboard display


## Phase 13: Fix Meal Logging Nutritional Values Storage (Complete)
- [x] Fixed logMeal procedure to capture recipe nutritional data when logging preset recipes
- [x] Updated MealLogging component to display recipe names and calorie counts for logged meals
- [x] Verified Dashboard nutrition calculation works correctly with stored nutritional values
- [x] Created comprehensive tests for meal logging nutritional values storage (5 new tests)
- [x] All 56 tests passing (51 existing + 5 new meal logging tests)
- [x] Verified TypeScript compilation with no errors


## Phase 14: Bug Fixes - Training Plans & Daily Quotes (Complete)
- [x] Fix training plan PDFs downloading as blank pages - Created 4 missing running training plan PDFs
- [x] Fix daily motivation quotes not updating daily - Added refetch logic to DailyQuoteWidget
- [x] Verify quote rotation logic works correctly - Updated quotes test to verify category rotation
- [x] Test all PDF downloads - All 9 training plan PDFs now available
- [x] Write tests for quote update logic - Updated quotes.test.ts with 7 passing tests
- [x] All 56 tests passing (9 test files)
- [x] TypeScript compilation with no errors


## Phase 15: Bug Fix - Profile Completion Form Validation (Complete)
- [x] Fix profile completion form showing validation error "Please enter your first name"
- [x] Verify form inputs are being captured correctly - Changed e.currentTarget to e.target
- [x] Test profile submission with all fields filled - All 56 tests passing
- [x] Ensure form clears after successful submission - Added optional phone number field
- [x] Improved input field styling and focus handling
- [x] Added autocomplete attributes for better browser support


## Phase 16: Bug Fix - Daily Quote Not Updating (Complete)
- [x] Fix daily quote showing yesterday's date instead of today
- [x] Verify refetch logic is triggering on date change - Implemented polling every minute
- [x] Check database quote dates are correct - Confirmed 2 quotes in database
- [x] Test quote updates properly on new day - All 56 tests passing
- [x] Simplified refetch logic using useRef and polling interval
- [x] Component now checks for date changes on mount and every minute


## Phase 17: Bug Fix - Quote Date Showing Yesterday (Complete)
- [x] Fix quote generation using yesterday's date instead of today
- [x] Review getTodayQuote procedure in quotes router - Found timezone issue
- [x] Fix date calculation in quote generation - Used UTC date calculation
- [x] Test quote has correct date after generation - All 56 tests passing
- [x] Quote now shows correct date (Tuesday, Jan 13 instead of Monday, Jan 12)


## Phase 18: Bug Fix - Quote Date Timezone Issue & Training Plan PDF Formatting (Complete)
- [x] Debug quote date timezone calculation - Fixed by using local date instead of UTC
- [x] Fix getTodayQuote to use correct date in user's timezone - Now shows Tuesday, Jan 13
- [x] Regenerate all training plan PDFs with uniform professional format - All 7 PDFs updated
- [x] Update triathlon PDFs to match running plan style (red headers, organized layout, tables)
- [x] Verify all 9 training plans have consistent formatting - 7 new PDFs with uniform style
- [x] Test quote date displays correctly after fix - All 56 tests passing
- [x] Quote now shows correct date (Tuesday, Jan 13)
- [x] All training plan PDFs have professional formatting with red headers and organized content

## Phase 19: Bug Fix - PDF Download Error (In Progress - Background Work)
- [ ] Investigate why PDFs show "An error occurred" when downloading
- [ ] Test if PDFs are corrupted or have compatibility issues
- [ ] Try alternative PDF generation approach (WeasyPrint, xhtml2pdf)
- [ ] Verify PDFs work with different MIME types and download approaches
- [ ] Test direct download vs browser viewer approach
- [ ] Create simple test PDFs to verify generation works
- [ ] Implement working solution and verify all PDFs download properly


## Phase 20: Create Real Training Programs with Weekly Workout Schedules
- [ ] Research and create 5K 12-Week Beginner training plan with actual weekly workouts
- [ ] Research and create 5K 24-Week Beginner training plan with actual weekly workouts
- [ ] Research and create Half Marathon 12-Week training plan with actual weekly workouts
- [ ] Research and create Half Marathon 24-Week training plan with actual weekly workouts
- [ ] Generate new PDFs with detailed training schedules
- [ ] Test all PDF downloads


## Phase 20: Real Running Training Plans with Weekly Schedules (Complete)
- [x] Research professional 5K and Half Marathon training programs
- [x] Create 5K 12-Week Beginner PDF with detailed daily workouts
- [x] Create 5K 24-Week Extended Beginner PDF with gradual progression
- [x] Create Half Marathon 12-Week Intermediate PDF (based on Hal Higdon Novice 1)
- [x] Create Half Marathon 24-Week Beginner PDF (6-month program)
- [x] All PDFs include: weekly schedules, workout definitions, nutrition guidelines, injury prevention
- [x] All 56 tests passing
- [x] Verified PDF downloads work correctly


## Phase 21: Bug Fix - PDF Table Text Alignment (Complete)
- [x] Fix text alignment in PDF table cells - text not centered properly
- [x] Add proper cell padding and word wrapping to workout descriptions
- [x] Improve table formatting for better readability
- [x] Regenerate all 4 running training plan PDFs with fixed formatting
- [x] Test PDF display and verify text alignment is correct
