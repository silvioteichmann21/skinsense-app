# Skin analysis TFLite model

Bundled model: `skin_analysis_v1.tflite`

- **Input:** 224×224×3 RGB, float32 normalized 0–1  
- **Output:** 20 sigmoid values (5 skin types + 15 concern dimensions)

Regenerate after retraining:

```bash
python3 scripts/generate_skin_model.py
```

Replace this file with a clinically validated model before production medical claims.
