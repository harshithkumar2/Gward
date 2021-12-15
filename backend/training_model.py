import numpy as np
import matplotlib.pyplot as plt
from keras.models import Sequential
from keras.layers import Convolution2D
from keras.layers import MaxPooling2D
from keras.layers import Dense
from keras.layers import Flatten
from keras.preprocessing import image
from keras.models import model_from_json
from keras.preprocessing.image import ImageDataGenerator
train_datagen = ImageDataGenerator(rescale=1. / 255,
                                   shear_range=0.2,
                                   zoom_range=0.2,
                                   horizontal_flip=True)

# Generating images for the Test set
test_datagen = ImageDataGenerator(rescale=1. / 255)
# Creating training set
training_set = train_datagen.flow_from_directory('data/train',
                                                 target_size=(64, 64),
                                                 batch_size=32,
                                                 class_mode='binary')
# Creating the Test set
test_set = test_datagen.flow_from_directory('data/test',
                                            target_size=(64, 64),
                                            batch_size=32,
                                            class_mode='binary')
classifier = Sequential()
# step1-convolution
classifier.add(Convolution2D(32, 3, 3, input_shape=(64, 64, 3), activation='relu'))
# step2-maxpooling
classifier.add(MaxPooling2D(pool_size=(2, 2)))
# step3-flattening
classifier.add(Flatten())
# step4-fullconnection
classifier.add(Dense(units=128, activation='relu'))
classifier.add(Dense(units=1, activation='sigmoid'))

classifier.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
classifier.fit(training_set, steps_per_epoch=1000//35, epochs=25, validation_data=test_set, validation_steps=600//35)