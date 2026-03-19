from youtube_transcript_api import YouTubeTranscriptApi

def get_transcript(video_id):
    transcript_list = YouTubeTranscriptApi().fetch(video_id)

    text = " ".join([entry.text for entry in transcript_list])

    return text