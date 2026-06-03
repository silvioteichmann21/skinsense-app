#!/usr/bin/env python3
"""Generate bundled skin_analysis_v1.tflite (5 skin types + 15 concern scores)."""

import os

import tensorflow as tf

OUTPUT = os.path.join(
    os.path.dirname(__file__),
    "..",
    "assets",
    "models",
    "skin_analysis_v1.tflite",
)

os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)

model = tf.keras.Sequential(
    [
        tf.keras.layers.Input(shape=(224, 224, 3)),
        tf.keras.layers.Rescaling(1.0 / 255.0),
        tf.keras.layers.Conv2D(16, 3, padding="same", activation="relu"),
        tf.keras.layers.MaxPooling2D(2),
        tf.keras.layers.Conv2D(32, 3, padding="same", activation="relu"),
        tf.keras.layers.GlobalAveragePooling2D(),
        tf.keras.layers.Dense(20, activation="sigmoid"),
    ]
)

converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_model = converter.convert()

with open(OUTPUT, "wb") as f:
    f.write(tflite_model)

print(f"Wrote {OUTPUT} ({len(tflite_model)} bytes)")
