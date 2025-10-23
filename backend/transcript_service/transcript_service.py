from flask import Flask, request, jsonify
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound

app = Flask(__name__)

@app.route("/transcript", methods=["GET"])
def transcript():
    video_id = request.args.get("video_id")
    if not video_id:
        return jsonify({"error": "video_id parameter is required"}), 400
    try:
        # Instantiate YouTubeTranscriptApi
        ytt_api = YouTubeTranscriptApi()
        fetched_transcript = ytt_api.fetch(video_id)  # fetch instead of get_transcript

        # Combine all text snippets into a single string
        text = " ".join([snippet.text for snippet in fetched_transcript])

        return jsonify({"transcript": text})
    except (TranscriptsDisabled, NoTranscriptFound):
        return jsonify({"error": "This video has no captions"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
