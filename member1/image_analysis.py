import cv2
import numpy as np
import os


def analyze_image(image_path):
    """
    Analyze an air-quality/environmental image using OpenCV.

    Returns visual indicators that can be combined with
    sensor-based pollution detection.
    """

    if not os.path.exists(image_path):
        return {
            "success": False,
            "error": "Image file not found."
        }

    # Read image
    image = cv2.imread(image_path)

    if image is None:
        return {
            "success": False,
            "error": "Unable to read the image."
        }

    # Convert color spaces
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    # Basic image statistics
    brightness = float(np.mean(gray))
    contrast = float(np.std(gray))

    # Estimate atmospheric haze using image contrast.
    # Lower contrast can be associated with hazier scenes,
    # but this is only a visual indicator.
    if contrast < 35:
        haze_level = "HIGH"
    elif contrast < 60:
        haze_level = "MODERATE"
    else:
        haze_level = "LOW"

    # Calculate saturation
    saturation = float(np.mean(hsv[:, :, 1]))

    # Calculate edge density
    edges = cv2.Canny(gray, 100, 200)
    edge_density = float(np.count_nonzero(edges) / edges.size)

    # Visual evidence score
    visual_score = 0

    if haze_level == "HIGH":
        visual_score += 40
    elif haze_level == "MODERATE":
        visual_score += 20

    if brightness < 70:
        visual_score += 20

    if contrast < 40:
        visual_score += 20

    if edge_density < 0.05:
        visual_score += 20

    visual_score = min(visual_score, 100)

    # Interpret visual evidence
    if visual_score >= 70:
        visual_assessment = "STRONG_VISUAL_INDICATOR"
    elif visual_score >= 40:
        visual_assessment = "MODERATE_VISUAL_INDICATOR"
    else:
        visual_assessment = "LOW_VISUAL_INDICATOR"

    return {
        "success": True,
        "image": os.path.basename(image_path),
        "brightness": round(brightness, 2),
        "contrast": round(contrast, 2),
        "saturation": round(saturation, 2),
        "edge_density": round(edge_density, 4),
        "haze_level": haze_level,
        "visual_score": visual_score,
        "visual_assessment": visual_assessment
    }


if __name__ == "__main__":

    print("\n========== AIRSHIELD IMAGE ANALYSIS ==========\n")

    # Change this path when testing with an actual image
    test_image = "member1/data/test_image.jpg"

    result = analyze_image(test_image)

    for key, value in result.items():
        print(f"{key}: {value}")