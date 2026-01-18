#!/usr/bin/env python3
"""Generate professional running training plan PDFs with detailed weekly schedules."""

from fpdf import FPDF
import os

class TrainingPlanPDF(FPDF):
    def __init__(self):
        super().__init__()
        self.set_auto_page_break(auto=True, margin=15)
        
    def header(self):
        pass
        
    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'Page {self.page_no()}', align='C')
        
    def add_title_page(self, title, subtitle, distance, duration, level):
        self.add_page()
        # Red header
        self.set_fill_color(200, 30, 50)
        self.rect(0, 0, 210, 60, 'F')
        
        self.set_font('Helvetica', 'B', 28)
        self.set_text_color(255, 255, 255)
        self.set_y(15)
        self.cell(0, 12, title, align='C')
        self.ln(15)
        self.set_font('Helvetica', '', 16)
        self.cell(0, 10, subtitle, align='C')
        
        self.set_y(75)
        self.set_text_color(0, 0, 0)
        
        # Program details box
        self.set_font('Helvetica', 'B', 14)
        self.set_fill_color(245, 245, 245)
        self.cell(0, 10, 'Program Details', fill=True)
        self.ln(12)
        
        self.set_font('Helvetica', '', 11)
        details = [
            ('Distance', distance),
            ('Duration', duration),
            ('Level', level),
            ('Training Days', '3-4 days per week'),
        ]
        for label, value in details:
            self.set_font('Helvetica', 'B', 11)
            self.cell(50, 8, f'{label}:')
            self.set_font('Helvetica', '', 11)
            self.cell(0, 8, value)
            self.ln(8)
            
    def add_section_header(self, title):
        self.ln(5)
        self.set_font('Helvetica', 'B', 14)
        self.set_text_color(200, 30, 50)
        self.cell(0, 10, title)
        self.ln(8)
        self.set_draw_color(200, 30, 50)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(5)
        self.set_text_color(0, 0, 0)
        
    def add_paragraph(self, text):
        self.set_font('Helvetica', '', 10)
        self.multi_cell(0, 6, text)
        self.ln(3)
        
    def add_week_schedule(self, week_num, week_data):
        """Add a properly formatted week schedule table."""
        # Week header
        self.set_font('Helvetica', 'B', 11)
        self.set_fill_color(200, 30, 50)
        self.set_text_color(255, 255, 255)
        self.cell(190, 8, f'Week {week_num}', fill=True, align='C')
        self.ln(8)
        
        # Column widths
        col_widths = [15, 25, 25, 25, 25, 25, 25, 25]
        
        # Day headers
        days = ['Day', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        self.set_fill_color(240, 240, 240)
        self.set_text_color(0, 0, 0)
        self.set_font('Helvetica', 'B', 8)
        
        for i, day in enumerate(days):
            self.cell(col_widths[i], 8, day, border=1, fill=True, align='C')
        self.ln(8)
        
        # Week data row
        self.set_font('Helvetica', '', 7)
        self.set_text_color(0, 0, 0)
        
        # Day number
        self.cell(col_widths[0], 18, str(week_num), border=1, align='C')
        
        # Workouts - use multi_cell for text wrapping
        x_start = self.get_x()
        y_start = self.get_y()
        
        for i, workout in enumerate(week_data):
            # Calculate position
            x = x_start + sum(col_widths[1:i+1])
            self.set_xy(x, y_start)
            
            # Add cell with text wrapping and proper alignment
            self.multi_cell(col_widths[i+1], 18, workout, border=1, align='C')
        
        # Move to next line after row
        self.set_y(y_start + 18)
        self.ln(2)


def create_5k_12week_pdf():
    """Create 5K 12-Week Beginner Training Plan PDF."""
    pdf = TrainingPlanPDF()
    pdf.add_title_page(
        '5K Training Plan',
        '12-Week Beginner Program',
        '5 kilometers (3.1 miles)',
        '12 weeks',
        'Beginner'
    )
    
    pdf.add_section_header('Program Overview')
    pdf.add_paragraph(
        'This 12-week beginner 5K training plan is designed for complete beginners who want to '
        'build up to running 5 kilometers (3.1 miles) continuously. The program uses a gradual '
        'run/walk progression that safely builds your endurance while minimizing injury risk. '
        'By the end of this program, you will be able to run a full 5K race.'
    )
    
    pdf.add_section_header('Training Phases')
    pdf.add_paragraph(
        'Weeks 1-4: Foundation Phase - Build basic fitness with run/walk intervals\n'
        'Weeks 5-8: Build Phase - Increase running duration, reduce walking\n'
        'Weeks 9-11: Peak Phase - Longer continuous runs with speed work\n'
        'Week 12: Race Week - Taper and race day'
    )
    
    pdf.add_section_header('Weekly Training Schedule')
    
    # 12-week schedule - simplified for better readability
    schedule = [
        ['Walk/Run\n10x30s', 'Cross\n20m', 'Rest', 'Walk/Run\n10x1m', 'Cross\n20m', 'Walk/Run\n12x1m', 'Rest'],
        ['Walk/Run\n10x60s', 'Cross\n25m', 'Rest', 'Walk/Run\n8x2m', 'Cross\n20m', 'Walk/Run\n10x60s', 'Rest'],
        ['Walk/Run\n8x2m', 'Cross\n25m', 'Rest', 'Walk/Run\n8x3m', 'Cross', 'Walk/Run\n6x4m', 'Rest'],
        ['Walk/Run\n5x5m', 'Cross\n30m', 'Rest', 'Walk/Run\n3x8m', 'Cross\n25m', 'Easy\n10m', 'Rest'],
        ['Easy\n15m', 'Cross\n30m', 'Rest', '2x10m\nrun/walk', 'Cross\n30m', 'Easy\n18m', 'Rest'],
        ['Easy\n20m', 'Cross\n35m', 'Rest', 'Speed\n5m+10x30s', 'Cross\n30m', '2x15m\nrun/walk', 'Rest'],
        ['Easy\n2mi', 'Cross\n40m', 'Rest', 'Speed\n7m+10x30s', 'Cross\n30m', 'Easy\n2.5mi', 'Rest'],
        ['Easy\n2.5mi', 'Cross\n45m', 'Rest', 'Speed\n5m+10x1m', 'Cross\n20m', 'Easy\n3mi', 'Rest'],
        ['Easy\n2.5mi', 'Cross\n45m', 'Rest', 'Speed\n21m+6x90s', 'Cross\n20m', '3mi+\nstrides', 'Rest'],
        ['Easy\n2.5mi', 'Cross\n45m', 'Rest', 'Speed\n30m+2x3m', 'Cross\n15m', '3mi+\nstrides', 'Rest'],
        ['Easy\n3mi', 'Cross\n45m', 'Rest', 'Speed\n12m+8m+10m', 'Cross\n20m', 'Easy\n3.5mi', 'Rest'],
        ['Easy\n3mi', 'Cross\n35m', 'Speed\n2x5m', 'Rest', 'Easy\n15m', 'Rest', '5K RACE'],
    ]
    
    for week_num, week_data in enumerate(schedule, 1):
        if pdf.get_y() > 240:
            pdf.add_page()
        pdf.add_week_schedule(week_num, week_data)
    
    pdf.add_page()
    pdf.add_section_header('Workout Definitions')
    pdf.add_paragraph(
        'Walk/Run: Alternate between running and walking. For example, "10x30s run/1min walk" means run for 30 seconds, walk for 1 minute, repeat 10 times.'
    )
    pdf.add_paragraph(
        'Easy Run: Run at a comfortable, conversational pace. You should be able to hold a conversation while running.'
    )
    pdf.add_paragraph(
        'Cross Training: Low-impact cardio such as cycling, swimming, elliptical, or brisk walking.'
    )
    pdf.add_paragraph(
        'Speed Work: Higher intensity intervals to build speed. Run the hard portions at a challenging but sustainable pace.'
    )
    pdf.add_paragraph(
        'Rest: Complete rest day. No running or intense exercise.'
    )
    
    pdf.add_section_header('Nutrition Guidelines')
    pdf.add_paragraph(
        '- Stay hydrated: Drink water throughout the day\n'
        '- Pre-run fuel: Eat a light snack 1-2 hours before running\n'
        '- Post-run recovery: Consume protein and carbs within 30 minutes\n'
        '- Race day: Stick to familiar foods'
    )
    
    pdf.add_section_header('Injury Prevention')
    pdf.add_paragraph(
        '- Warm up with 5 minutes of walking before each run\n'
        '- Cool down with 5 minutes of walking after each run\n'
        '- Stretch major muscle groups after running\n'
        '- Increase weekly mileage by no more than 10% per week\n'
        '- Listen to your body - take extra rest if needed'
    )
    
    pdf.output('client/public/5k_12week.pdf')
    print('Created: 5k_12week.pdf')


def create_5k_24week_pdf():
    """Create 5K 24-Week Beginner Training Plan PDF."""
    pdf = TrainingPlanPDF()
    pdf.add_title_page(
        '5K Training Plan',
        '24-Week Extended Beginner Program',
        '5 kilometers (3.1 miles)',
        '24 weeks',
        'Beginner'
    )
    
    pdf.add_section_header('Program Overview')
    pdf.add_paragraph(
        'This 24-week extended beginner 5K training plan is designed for complete beginners who '
        'want a very gradual, low-pressure approach to running. The extended timeline allows for '
        'more recovery time between progressions.'
    )
    
    pdf.add_section_header('Training Phases')
    pdf.add_paragraph(
        'Weeks 1-6: Foundation Phase - Walking and very light run/walk intervals\n'
        'Weeks 7-12: Base Building Phase - Gradually increase running intervals\n'
        'Weeks 13-18: Development Phase - Build continuous running ability\n'
        'Weeks 19-23: Peak Phase - Longer runs with some speed work\n'
        'Week 24: Race Week - Taper and race day'
    )
    
    pdf.add_section_header('Weekly Training Schedule')
    
    # 24-week schedule - simplified
    schedule = [
        ['Walk\n20m', 'Rest', 'Walk\n20m', 'Rest', 'Walk\n25m', 'Rest', 'Walk\n30m'],
        ['Walk\n25m', 'Rest', 'Walk\n25m', 'Rest', 'Walk\n30m', 'Rest', 'Walk\n30m'],
        ['Walk/Run\n5x30s', 'Rest', 'Walk\n30m', 'Rest', 'Walk/Run\n5x30s', 'Rest', 'Walk\n35m'],
        ['Walk/Run\n6x30s', 'Rest', 'Walk\n30m', 'Rest', 'Walk/Run\n6x30s', 'Rest', 'Walk\n35m'],
        ['Walk/Run\n8x30s', 'Rest', 'Walk\n30m', 'Rest', 'Walk/Run\n8x30s', 'Rest', 'Walk\n40m'],
        ['Walk/Run\n10x30s', 'Rest', 'Walk\n30m', 'Rest', 'Walk/Run\n10x30s', 'Rest', 'Walk\n40m'],
        ['Walk/Run\n8x1m', 'Cross\n20m', 'Rest', 'Walk/Run\n8x1m', 'Rest', 'Walk/Run\n10x1m', 'Rest'],
        ['Walk/Run\n6x90s', 'Cross\n20m', 'Rest', 'Walk/Run\n6x90s', 'Rest', 'Walk/Run\n8x90s', 'Rest'],
        ['Walk/Run\n5x2m', 'Cross\n25m', 'Rest', 'Walk/Run\n5x2m', 'Rest', 'Walk/Run\n6x2m', 'Rest'],
        ['Walk/Run\n4x3m', 'Cross\n25m', 'Rest', 'Walk/Run\n4x3m', 'Rest', 'Walk/Run\n5x3m', 'Rest'],
        ['Walk/Run\n3x4m', 'Cross\n30m', 'Rest', 'Walk/Run\n3x4m', 'Rest', 'Walk/Run\n4x4m', 'Rest'],
        ['Walk/Run\n3x5m', 'Cross\n30m', 'Rest', 'Walk/Run\n3x5m', 'Rest', 'Walk/Run\n4x5m', 'Rest'],
        ['Walk/Run\n2x8m', 'Cross\n30m', 'Rest', 'Walk/Run\n2x8m', 'Rest', 'Walk/Run\n3x6m', 'Rest'],
        ['Walk/Run\n2x10m', 'Cross\n30m', 'Rest', 'Walk/Run\n2x10m', 'Rest', 'Easy\n15m', 'Rest'],
        ['Easy\n12m', 'Cross\n35m', 'Rest', 'Walk/Run\n2x12m', 'Rest', 'Easy\n18m', 'Rest'],
        ['Easy\n15m', 'Cross\n35m', 'Rest', 'Easy\n15m', 'Rest', 'Easy\n20m', 'Rest'],
        ['Easy\n18m', 'Cross\n35m', 'Rest', 'Easy\n18m', 'Rest', 'Easy\n22m', 'Rest'],
        ['Easy\n20m', 'Cross\n40m', 'Rest', 'Easy\n20m', 'Rest', 'Easy\n25m', 'Rest'],
        ['Easy\n1.5mi', 'Cross\n40m', 'Rest', 'Speed\n5m+6x30s', 'Rest', 'Easy\n2mi', 'Rest'],
        ['Easy\n2mi', 'Cross\n40m', 'Rest', 'Speed\n5m+8x30s', 'Rest', 'Easy\n2.5mi', 'Rest'],
        ['Easy\n2mi', 'Cross\n45m', 'Rest', 'Speed\n10m+6x45s', 'Rest', 'Easy\n2.5mi', 'Rest'],
        ['Easy\n2.5mi', 'Cross\n45m', 'Rest', 'Speed\n10m+4x1m', 'Rest', 'Easy\n3mi', 'Rest'],
        ['Easy\n2.5mi', 'Cross\n40m', 'Rest', 'Speed\n15m+3x1m', 'Rest', 'Easy\n3mi', 'Rest'],
        ['Easy\n2mi', 'Cross\n30m', 'Rest', 'Easy\n15m+\nstrides', 'Rest', 'Rest', '5K RACE'],
    ]
    
    for week_num, week_data in enumerate(schedule, 1):
        if pdf.get_y() > 240:
            pdf.add_page()
        pdf.add_week_schedule(week_num, week_data)
    
    pdf.add_page()
    pdf.add_section_header('Workout Definitions')
    pdf.add_paragraph(
        'Walk: Brisk walking at a pace that elevates your heart rate slightly.'
    )
    pdf.add_paragraph(
        'Walk/Run: Alternate between running and walking for the specified intervals.'
    )
    pdf.add_paragraph(
        'Easy Run: Run at a comfortable, conversational pace.'
    )
    pdf.add_paragraph(
        'Cross Training: Low-impact cardio such as cycling, swimming, or elliptical.'
    )
    pdf.add_paragraph(
        'Speed Work: Higher intensity intervals at a challenging but sustainable pace.'
    )
    
    pdf.output('client/public/5k_24week.pdf')
    print('Created: 5k_24week.pdf')


def create_half_marathon_12week_pdf():
    """Create Half Marathon 12-Week Training Plan PDF."""
    pdf = TrainingPlanPDF()
    pdf.add_title_page(
        'Half Marathon Training',
        '12-Week Intermediate Program',
        '21.1 kilometers (13.1 miles)',
        '12 weeks',
        'Intermediate'
    )
    
    pdf.add_section_header('Program Overview')
    pdf.add_paragraph(
        'This 12-week half marathon training plan is based on Hal Higdon\'s proven Novice 1 program. '
        'It is designed for runners who can already run 3 miles comfortably and want to prepare for '
        'their first half marathon.'
    )
    
    pdf.add_section_header('Prerequisites')
    pdf.add_paragraph(
        '- Ability to run 3 miles continuously\n'
        '- Running 3-4 times per week for at least 4-6 weeks\n'
        '- No major injuries or health concerns\n'
        '- Comfortable running at a conversational pace'
    )
    
    pdf.add_section_header('Weekly Training Schedule')
    
    # 12-week schedule - simplified
    schedule = [
        ['Rest', '3mi', '2mi\nor\ncross', '3mi', 'Rest', '30m\ncross', '4mi'],
        ['Rest', '3mi', '2mi\nor\ncross', '3mi', 'Rest', '30m\ncross', '4mi'],
        ['Rest', '3.5mi', '2mi\nor\ncross', '3.5mi', 'Rest', '40m\ncross', '5mi'],
        ['Rest', '3.5mi', '2mi\nor\ncross', '3.5mi', 'Rest', '40m\ncross', '5mi'],
        ['Rest', '4mi', '2mi\nor\ncross', '4mi', 'Rest', '40m\ncross', '6mi'],
        ['Rest', '4mi', '2mi\nor\ncross', '4mi', 'Rest\nor\neasy', 'Rest', '5K\nRace'],
        ['Rest', '4.5mi', '3mi\nor\ncross', '4.5mi', 'Rest', '50m\ncross', '7mi'],
        ['Rest', '4.5mi', '3mi\nor\ncross', '4.5mi', 'Rest', '50m\ncross', '8mi'],
        ['Rest', '5mi', '3mi\nor\ncross', '5mi', 'Rest\nor\neasy', 'Rest', '10K\nRace'],
        ['Rest', '5mi', '3mi\nor\ncross', '5mi', 'Rest', '60m\ncross', '9mi'],
        ['Rest', '5mi', '3mi\nor\ncross', '5mi', 'Rest', '60m\ncross', '10mi'],
        ['Rest', '4mi', '3mi\nor\ncross', '2mi', 'Rest', 'Rest', 'HALF\nMARATHON'],
    ]
    
    for week_num, week_data in enumerate(schedule, 1):
        if pdf.get_y() > 240:
            pdf.add_page()
        pdf.add_week_schedule(week_num, week_data)
    
    pdf.add_page()
    pdf.add_section_header('Workout Definitions')
    pdf.add_paragraph(
        'Run: Run at a comfortable, conversational pace. Your target heart rate should be 65-75% of your maximum.'
    )
    pdf.add_paragraph(
        'Cross Training: Swimming, cycling, elliptical, or other low-impact cardio.'
    )
    pdf.add_paragraph(
        'Long Run: The Sunday long runs are the most important workouts. Run at a comfortable pace.'
    )
    pdf.add_paragraph(
        'Rest: Complete rest from running. Light walking and stretching are fine.'
    )
    
    pdf.add_section_header('Pacing Guidelines')
    pdf.add_paragraph(
        '- Easy runs: Conversational pace\n'
        '- Long runs: Slightly slower than easy pace\n'
        '- Race pace: Faster than training pace, but sustainable\n'
        '- Tune-up races: Run at your current fitness level'
    )
    
    pdf.output('client/public/half_marathon_12week.pdf')
    print('Created: half_marathon_12week.pdf')


def create_half_marathon_24week_pdf():
    """Create Half Marathon 24-Week Beginner Training Plan PDF."""
    pdf = TrainingPlanPDF()
    pdf.add_title_page(
        'Half Marathon Training',
        '24-Week Beginner Program',
        '21.1 kilometers (13.1 miles)',
        '24 weeks (6 months)',
        'Beginner'
    )
    
    pdf.add_section_header('Program Overview')
    pdf.add_paragraph(
        'This 24-week beginner half marathon training plan is designed for runners who are new to '
        'the half marathon distance and want a gradual, sustainable approach to training.'
    )
    
    pdf.add_section_header('Training Phases')
    pdf.add_paragraph(
        'Weeks 1-8: Foundation Phase - Build base fitness with 3 runs per week\n'
        'Weeks 9-16: Build Phase - Increase volume and introduce speed work\n'
        'Weeks 17-23: Peak Phase - Longest runs and highest training load\n'
        'Week 24: Taper Week - Reduce training to rest up for race day'
    )
    
    pdf.add_section_header('Weekly Training Schedule')
    
    # 24-week schedule - simplified
    schedule = [
        ['Rest', 'Easy\n25m', 'Cross\n30m', 'Int\n20m', 'Rest', 'Cross\n30m', 'Long\n35m'],
        ['Rest', 'Easy\n25m', 'Cross\n30m', 'Int\n25m', 'Rest', 'Cross\n30m', 'Long\n40m'],
        ['Rest', 'Easy\n30m', 'Cross\n30m', 'Int\n25m', 'Rest', 'Cross\n35m', 'Long\n45m'],
        ['Rest', 'Easy\n30m', 'Cross\n30m', 'Int\n30m', 'Rest', 'Cross\n35m', 'Long\n45m'],
        ['Rest', 'Easy\n25m', 'Cross\n25m', 'Int\n20m', 'Rest', 'Cross\n25m', 'Long\n35m'],
        ['Rest', 'Easy\n30m', 'Cross\n35m', 'Int\n30m', 'Rest', 'Cross\n35m', 'Long\n50m'],
        ['Rest', 'Easy\n35m', 'Cross\n35m', 'Int\n30m', 'Rest', 'Cross\n40m', 'Long\n55m'],
        ['Rest', 'Easy\n30m', 'Cross\n30m', 'Int\n25m', 'Rest', 'Cross\n30m', 'Long\n45m'],
        ['Rest', 'Easy\n35m', 'Cross\n40m', 'Tempo\n30m', 'Rest', 'Cross\n40m', 'Long\n60m'],
        ['Rest', 'Easy\n40m', 'Cross\n40m', 'Tempo\n35m', 'Rest', 'Cross\n45m', 'Long\n65m'],
        ['Rest', 'Easy\n40m', 'Cross\n45m', 'Tempo\n35m', 'Rest', 'Cross\n45m', 'Long\n70m'],
        ['Rest', 'Easy\n35m', 'Cross\n35m', 'Int\n30m', 'Rest', 'Cross\n35m', 'Long\n55m'],
        ['Rest', 'Easy\n45m', 'Cross\n45m', 'Tempo\n40m', 'Rest', 'Cross\n50m', 'Long\n75m'],
        ['Rest', 'Easy\n45m', 'Cross\n50m', 'Tempo\n45m', 'Rest', 'Cross\n50m', 'Long\n80m'],
        ['Rest', 'Easy\n50m', 'Cross\n50m', 'Tempo\n45m', 'Rest', 'Cross\n55m', 'Long\n85m'],
        ['Rest', 'Easy\n40m', 'Cross\n40m', 'Int\n35m', 'Rest', 'Cross\n40m', 'Long\n65m'],
        ['Rest', 'Easy\n50m', 'Cross\n55m', 'Tempo\n50m', 'Rest', 'Cross\n55m', 'Long\n90m'],
        ['Rest', 'Easy\n55m', 'Cross\n55m', 'Tempo\n50m', 'Rest', 'Cross\n60m', 'Long\n95m'],
        ['Rest', 'Easy\n55m', 'Cross\n60m', 'Tempo\n55m', 'Rest', 'Cross\n60m', 'Long\n100m'],
        ['Rest', 'Easy\n45m', 'Cross\n45m', 'Int\n40m', 'Rest', 'Cross\n45m', 'Long\n75m'],
        ['Rest', 'Easy\n60m', 'Cross\n60m', 'Tempo\n55m', 'Rest', 'Cross\n60m', 'Long\n110m'],
        ['Rest', 'Easy\n60m', 'Cross\n65m', 'Tempo\n60m', 'Rest', 'Cross\n65m', 'Long\n120m'],
        ['Rest', 'Easy\n55m', 'Cross\n60m', 'Tempo\n55m', 'Rest', 'Cross\n60m', 'Long\n130m'],
        ['Rest', 'Easy\n35m', 'Cross\n30m', 'Easy\n25m', 'Rest', 'Rest', 'HALF\nMARATHON'],
    ]
    
    for week_num, week_data in enumerate(schedule, 1):
        if pdf.get_y() > 240:
            pdf.add_page()
        pdf.add_week_schedule(week_num, week_data)
    
    pdf.add_page()
    pdf.add_section_header('Workout Definitions')
    pdf.add_paragraph(
        'Easy Run: Run at a comfortable, conversational pace. Heart rate Zone 1-2 (65-75% max).'
    )
    pdf.add_paragraph(
        'Long Run: The most important workout. Run at easy pace, slower than normal runs.'
    )
    pdf.add_paragraph(
        'Intervals: Speed work with periods of harder running followed by recovery.'
    )
    pdf.add_paragraph(
        'Tempo Run: Comfortably hard pace that you could sustain for about an hour.'
    )
    pdf.add_paragraph(
        'Cross Training: Low-impact cardio like cycling, swimming, or elliptical.'
    )
    
    pdf.add_section_header('Training Principles')
    pdf.add_paragraph(
        '- 70-80% of training should be at low intensity (easy pace)\n'
        '- Rest weeks (every 4th week) are crucial for adaptation\n'
        '- The long run is the most important workout\n'
        '- Cross-training helps prevent overuse injuries\n'
        '- Listen to your body - take extra rest if needed'
    )
    
    pdf.output('client/public/half_marathon_24week.pdf')
    print('Created: half_marathon_24week.pdf')


if __name__ == '__main__':
    os.chdir('/home/ubuntu/triathlon_nutrition_tracker')
    
    print('Generating running training plan PDFs...')
    create_5k_12week_pdf()
    create_5k_24week_pdf()
    create_half_marathon_12week_pdf()
    create_half_marathon_24week_pdf()
    print('All PDFs generated successfully!')
