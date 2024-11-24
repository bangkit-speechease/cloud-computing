from flask import Flask
from flask import request
from flask import jsonify
import os
import numpy as np
import librosa
import tensorflow as tf
import tensorflow_hub as hub

#For testing = http://127.0.0.1:5000/predict
app = Flask(__name__)

#Load the model
model = tf.keras.models.load_model('./model/speech_classification.h5')

#Initialize YAMNet layer
yamnet_url = "https://tfhub.dev/google/yamnet/1"
yamnet_layer = hub.KerasLayer(yamnet_url, trainable=False)

#Load audio files and process waveform
def load_audio_waveform(audio_path, sr=16000):
    try:
        waveform, _ = librosa.load(audio_path, sr=sr, mono=True)
        #Amplitude normalization of audio signals
        waveform = librosa.util.normalize(waveform)
        return waveform
    except Exception as e:
        raise ValueError(f"Error loading audio: {str(e)}")

#Load YAMNet for extracting audio
def extract_yamnet_features(waveform, sr=16000):
    try:
        waveform = tf.convert_to_tensor(waveform, dtype=tf.float32)
        scores, embeddings, _ = yamnet_layer(waveform)
        return tf.reduce_mean(embeddings, axis=0).numpy()
    except Exception as e:
        raise ValueError(f"Error extracting features: {str(e)}")

@app.route('/predict', methods=['POST'])
def predict():
    #Key for testing must be filled with = file
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    #Get file from request
    file = request.files['file']
    
    #Save file temporarily
    file_path = f"{file.filename}"
    file.save(file_path)

    try:
        #Load the audio file and preprocess it
        waveform = load_audio_waveform(file_path)

        #Extract YAMNet features
        features = extract_yamnet_features(waveform)

        #Prepare input for model (adjust dimensions for prediction)
        input_data = np.expand_dims(features, axis=0) 

        #Predict using the trained model (get the probability)
        predictions = model.predict(input_data)[0][0] 

        #Map prediction to class
        if predictions >= 0.5:
            result = "Masih Salah, Coba Lagi"
        else:
            result = "Bagus, Mari Lanjutkan"

        response = {
            'prediction_score': float(predictions),
            'predicted_label': result
        }
        
    except Exception as e:
        return jsonify({'error': f'Error processing audio: {str(e)}'}), 500
    
    finally:
        #Cleanup temporary file
        os.remove(file_path)  

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
