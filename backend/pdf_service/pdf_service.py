from flask import Flask, request, send_file
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import io

app = Flask(__name__)

@app.route("/generate-pdf", methods=["POST"])
def generate_pdf():
    data = request.json
    notes = data.get("notes", "")

    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)

    # Page settings
    width, height = letter
    margin = 50
    line_height = 14
    y_position = height - margin

    c.setFont("Helvetica", 12)
    c.drawString(margin, y_position, "AI Generated Notes")
    y_position -= 2 * line_height  # Leave some space below title

    for line in notes.splitlines():
        if y_position <= margin:  # if near bottom → new page
            c.showPage()
            c.setFont("Helvetica", 12)
            y_position = height - margin
        c.drawString(margin, y_position, line)
        y_position -= line_height

    c.save()
    buffer.seek(0)

    return send_file(buffer, as_attachment=True, download_name="notes.pdf", mimetype='application/pdf')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
