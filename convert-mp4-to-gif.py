from moviepy import VideoFileClip
import sys
import os

# Set up script directory
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)
print(f"Script running in directory: {script_dir}")

# Get the mp4 file path from command-line arguments
mp4_path = sys.argv[1]
print(f"MP4 path received: {mp4_path}")

try:
    # Check if the input file exists
    if not os.path.isfile(mp4_path):
        raise FileNotFoundError(f"File not found: {mp4_path}")
    print(f"File found: {mp4_path}")

    # Create output directory
    os.makedirs("public/images", exist_ok=True)
    print("Successfully created or found 'public/images' directory.")

    # Load video and trim to the first 5 seconds
    print("Loading video...")
    videoClip = VideoFileClip(mp4_path)
    print(f"Video duration: {videoClip.duration} seconds")

    trimmedClip = videoClip.subclipped(0, min(5, videoClip.duration))
    print(f"Trimmed video to {min(5, videoClip.duration)} seconds")

    # Export GIF with 10 fps
    image_name = os.path.splitext(os.path.basename(mp4_path))[0]
    output_file = os.path.join("public/images", f"{image_name}.gif")
    print(f"Saving GIF to: {output_file}")

    trimmedClip.write_gif(output_file, fps=10)
    print(f"GIF saved successfully as '{output_file}'")

    # Close the video clip
    videoClip.close()
    print("Video processing completed and resources released.")

except Exception as e:
    print("Error:", e)
