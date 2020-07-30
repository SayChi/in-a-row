import numpy as numpy
import torch
import torch.nn as nn

#inp = torch.tensor(([2,9],[1,5],[3,6]), dtype=torch.float) #3x2 tensor
#out = torch.tensor(([92],[100],[89]),dtype=torch.float) #3x1 tensor

amountOfNeuralNetwork = 100

toPredict = torch.tensor(([4,8]), dtype=torch.float) #1x2 tensor

class Neural_Network(nn.Module):
	def __init__(self, ):
		super(Neural_Network, self).__init__()

		#change parameters
		self.inputSize  = 2
		self.outputSize = 2
		self.hiddenSize = 5

		#weights
		self.W1 = torch.randn(self.inputSize, self.hiddenSize)
		self.W2 = torch.randn(self.hiddenSize, self.outputSize)

	def forward(self, X):
		self.z  = torch.matmul(X, self.W1) #Multiplication
		self.z2 = self.sigmoid(self.z)     #activation function
		self.z3 = torch.matmul(self.z2, self.W2)
		act = self.sigmoid(self.z3) #final activition function

		return act

	#sigmoid function
	def sigmoid(self, s):
		return 1 / (1 + torch.exp(-s))

    #derivative of sigmoid
	def sigmoidPrime(self, s):
		return s * (1 - s)

	def backward(self, X, y, at):
		return 0
		#not needed in our case.

	def predict(self):
		print("predicted : " + str(self.forward(toPredict)))

list_objects = []

for i in range (amountOfNeuralNetwork):
	list_objects.append(Neural_Network())

print (len(list_objects))

list_objects[1].predict()


