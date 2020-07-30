import numpy as numpy
import torch
import torch.nn as nn

#inp = torch.tensor(([2,9],[1,5],[3,6]), dtype=torch.float) #3x2 tensor
#out = torch.tensor(([92],[100],[89]),dtype=torch.float) #3x1 tensor

amountOfNeuralNetwork = 100

toPredict = torch.tensor(([4,8]), dtype=torch.float) #1x2 tensor

list_objects = []
lifeOrDie = []

class Neural_Network(nn.Module):
	def __init__(self, ):
		super(Neural_Network, self).__init__()

		#change parameters
		self.inputSize  = 2
		self.outputSize = 2
		self.hiddenSize = 4
		self.hiddenLayerSize = 1
		self.learningRate = 1e-3

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

	def weightListV(self):
		weightList = []
		for i in range(self.hiddenLayerSize+1):
			weightList.append(getattr(self, 'W'+str(i+1)))
		return weightList

	def weightAdjust(self, weightsL):
		for i in range(len(weightsL)):
			tree = getattr(self, 'W'+str(i+1))
			for j in range(len(weightsL[i])):
				#gets every weight per node
				branch = tree[j]
				for z in range(len(weightsL[i][j])):
					val = (numpy.random.randint(-1000, 1000, size=1)/1000)*self.learningRate
					leaf = branch[z]
					getattr(self, 'W'+str(i+1))[j][z] = weightsL[i][j][z] + val	



def evolutionFunc():
	listOfSurvivors = []
	listOfLosers = []
	for j in range (amountOfNeuralNetwork):
		if lifeOrDie[j] == 1:
		  	listOfSurvivors.append(j)
		else:
			listOfLosers.append(j)

	if (len(listOfSurvivors)) > 0:
		for i in range (len(listOfLosers)):
			 whoIsYourDady = numpy.random.randint((len(listOfSurvivors)+1), size=1)
			 list_objects[i].weightAdjust(list_objects[int(whoIsYourDady)].weightListV())
	else :
		print('no one won.. so create new set')
		for i in range (amountOfNeuralNetwork):
			list_objects[i] = (Neural_Network())
			resetWin()

def resetWin():
	for i in range (amountOfNeuralNetwork):
		lifeOrDie[i] = 0

for i in range (amountOfNeuralNetwork):
	list_objects.append(Neural_Network())
	lifeOrDie.append(0)


print (len(list_objects))

#list_objects[1].predict()
print (list_objects[0].weightListV())
print('')
print (list_objects[1].weightListV())
print('')
#(list_objects[0].weightAdjust(list_objects[1].weightListV()))
#print (list_objects[0].weightListV())
#print('')

lifeOrDie[1] = 1
evolutionFunc()
print (list_objects[0].weightListV())
print('')

resetWin()





