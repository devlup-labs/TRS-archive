Perceptron Learning Algorithm Implementation


Initial Files:
	



Working of the code:

Train.py
	Taking input from user of the train_file (train.txt)
	Initialize weights with 0 value
	Normalizing the data using StandardScaler
	Applied the perceptron_algorithm to update weights based on the missclassification
	The convergence condition was kept untill all data dont get correctly classified
	The learned weights are saved to a file named 'weights.txt' locally.
	

Test.py
	Loading the weights from the weights.txt
	Taking input from user of the test_file (test.txt)
 	The code reads the test data from a file specified by the user,normalizing it and adding the bias term.
 	Applies the learned weights to predict the labels. 
 	And gives output of each label
 	The predicted labels are saved to a file named 'pred_val.txt' (space seperated) .

4. File Description:

perceptron.py: Contains the Python code implementing the Perceptron Learning Algorithm.
train.txt: Sample training data file containing features and labels.
test.txt: Sample test data file containing features.
5. Running the Code:

Execute the Python script perceptron.py.
Provide the file names for training and test data when prompted.
The script will output the learned weights, number of iterations, and predicted labels.
6. Output Files:

weights.txt: Contains the learned weights from the training data.
pred_val.txt: Contains the predicted labels for the test data.
Note: Ensure that the data files are formatted properly, with features and labels separated by spaces or tabs. The first line of the data file should specify the number of entries in the file.






