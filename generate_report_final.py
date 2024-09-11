from fpdf import FPDF
# pdf.cell(Width, Height, Data)

class PDFReport(FPDF):
    def __init__(self):
        super().__init__()
        self.add_page()
        self.set_auto_page_break(auto=True, margin=15)

    def add_title_page(self, image_path, title_text, subtitle_text):
        self.image(image_path, x=0, y=0, w=210, h=297)

        self.set_font("Helvetica", "", 23)

        # Title
        title_width = self.get_string_width(title_text)
        self.set_xy((210 - title_width) / 2, 186)  # Adjust Y as needed
        self.cell(title_width, 10, title_text, align="C")

        # Date
        self.set_font("Helvetica", "", 18)
        subtitle_width = self.get_string_width(subtitle_text)
        self.set_xy((210 - subtitle_width) / 2, 247)  # Adjust Y as needed
        self.cell(subtitle_width, 10, subtitle_text, align="C")

        self.add_page()

    def add_executive_summary(self, heading, summary_text, image_path):
        # Add heading
        self.set_font("Arial", "B", 16)
        self.set_text_color(0, 0, 0)  # Black color for heading
        self.cell(0, 10, heading, ln=True, align="L")

        # Add executive summary text (dynamic)
        self.ln(5)  # Space after heading
        self.set_font("Arial", "", 12)
        self.multi_cell(0, 6, summary_text)  # The text will wrap dynamically

        # Get the Y position after the text
        y_after_text = self.get_y()

        # Add the image just below the text
        self.image(image_path, x=35, y=y_after_text + 5, w=150)  # Adjust image width and padding
        self.add_page()

    def add_section(self, section_title, quote, explanation):
        #  Dark Blue: RGB(0, 51, 102)
        self.set_text_color(0, 0, 0)
        self.set_font("Helvetica", "B", 12)

        # Light Blue: RGB(200, 220, 255)
        self.set_fill_color(178, 178, 178)
        self.cell(0, 8, section_title, ln=True, fill=True)  

        # Black: RGB(0, 0, 0)
        self.set_text_color(0, 0, 0)

        # Article 
        self.set_font("Helvetica", "B", 10)
        self.ln(3)
        self.cell(0, 8, "Relevant Article(s):", ln=True)  

        # Article Quoted
        self.set_font("Helvetica", "I", 10)
        self.multi_cell(0, 8, quote)  

        # Remidiation Title
        self.set_font("Helvetica", "B", 10)
        self.ln(3)
        self.cell(0, 8, "Recommended Remidiations:", ln=True)  

        # Remidiation COntent
        self.set_font("Helvetica", "", 10)
        self.ln(1)
        self.multi_cell(0, 8, explanation)  
        self.ln(4)

# Generate the PDF dynamically based on user input
def generate_report(sections):
    pdf = PDFReport()
    pdf.add_title_page("final-cover.png", "ABC Company", "8 September, 2024")
    pdf.add_executive_summary("Executive Summary","ABC Company demonstrates strong adherence to regulatory compliance, with high scores across key principles like accountability governance, consent and notices, processing principles, and breach management. Areas for improvement include privacy by design and default, data subject rights, protection impact assessment, and records of processing. Overall, ABC's compliance posture is robust, showcasing a commitment to data protection and responsible handling of personal information.","Seprate.png")

    for section in sections:
        pdf.add_section(section['title'], section['quote'], section['explanation'])

    # Save the file
    pdf.output("dynamic_report.pdf")

# Example dummy data
sections = [
    {
        'title': " Do you maintain records management and data retention policies?",
        'quote': "Taking into account the nature, scope, context and purposes of processing as well as the risks of varying likelihood and severity for the rights and freedoms of natural persons, the controller shall implement appropriate technical and organisational measures to ensure and to be able to demonstrate that processing is performed in accordance with this Regulation. Those measures shall be reviewed and updated where necessary.",
        'explanation': "Develop and implement a comprehensive records management and data retention policy. Ensure that it aligns with GDPR requirements and that employees are trained on its application."
    },
    {
        'title': " Have you documented principles to justify retention periods?",
        'quote': """Personal data shall be:
    (a)processed lawfully, fairly and in a transparent manner in relation to the data subject ('lawfulness, fairness and transparency');
    (b)collected for specified, explicit and legitimate purposes and not further processed in a manner that is incompatible with those purposes; further processing for archiving purposes in the public interest, scientific or historical research purposes or statistical purposes shall, in accordance with Article 89(1), not be considered to be incompatible with the initial purposes ('purpose limitation';
    (c)adequate, relevant and limited to what is necessary in relation to the purposes for which they are processed ('data minimisation');
    (d)accurate and, where necessary, kept up to date; every reasonable step must be taken to ensure that personal data that are inaccurate, having regard to the purposes for which they are processed, are erased or rectified without delay ('accuracy');
    (e)kept in a form which permits identification of data subjects for no longer than is necessary for the purposes for which the personal data are processed; personal data may be stored for longer periods insofar as the personal data will be processed solely for archiving purposes in the public interest, scientific or historical research purposes or statistical purposes in accordance with Article 89(1) subject to implementation of the appropriate technical and organisational measures required by this Regulation in order to safeguard the rights and freedoms of the data subject ('storage limitation');
    (f)processed in a manner that ensures appropriate security of the personal data, including protection against unauthorised or unlawful processing and against accidental loss, destruction or damage, using appropriate technical or organisational measures ('integrity and confidentiality').""",
        'explanation': "Establish clear and documented principles that justify the retention periods for personal data. Regularly review and update these principles to ensure compliance with GDPR."
    }
]

generate_report(sections)