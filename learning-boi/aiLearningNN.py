import numpy as numpy
import torch
import torch.nn as nn

#inp = torch.tensor(([2,9],[1,5],[3,6]), dtype=torch.float) #3x2 tensor
#out = torch.tensor(([92],[100],[89]),dtype=torch.float) #3x1 tensor

#changeable parameters
amountOfNeuralNetwork = 10
batchSize = 1


#ask for the right settings:
print('field settings + playaaah?')
ans = input('field_x: ,  field_y,  howManyOnARow, player1?')
x = ans.split(",")

#Process the right information.
inputSize = int(x[0]) * int(x[1])
winCond = int(x[2])
playerOne = int(x[3])

print(inputSize)
print(winCond)
print(playerOne)

toPredict = torch.tensor(([4,8]), dtype=torch.float) #1x2 tensor

list_objects = []
lifeOrDie = []

class Neural_Network(nn.Module):
	def __init__(self, ):
		super(Neural_Network, self).__init__()

		#change parameters
		self.inputSize  = 2
		self.outputSize = 6
		self.hiddenSize = 10
		self.hiddenLayerSize = 2
		self.learningRate = 1e-3

        #weights met de hand aanpassen..
		self.W1 = torch.randn(self.inputSize, self.hiddenSize)
		self.W2 = torch.randn(self.hiddenSize, self.hiddenSize)
		self.W3 = torch.randn(self.hiddenSize, self.outputSize)

		#Hand matig aanpassen aan aantal hidden layers...
	def forward(self, X):
		self.z  = torch.matmul(X, self.W1) #Multiplication
		self.z2 = self.sigmoid(self.z)     #activation function
		self.z3 = torch.matmul(self.z2, self.W2)
		self.z4 = self.sigmoid(self.z3)
		self.z5 = torch.matmul(self.z4, self.W3)
		act = self.sigmoid(self.z5) #final activition function

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
		return self.forward(toPredict)

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
					getattr(self, 'W'+str(i+1))[j][z] = weightsL[i][j][z] +val



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
			 whoIsYourDady = numpy.random.randint((len(listOfSurvivors)), size=1)
			 list_objects[i].weightAdjust(list_objects[listOfSurvivors[int(whoIsYourDady)]].weightListV())
	else :
		print('no one won.. so create new set')
		for i in range (amountOfNeuralNetwork):
			list_objects[i] = (Neural_Network())
			resetWin()


def resetWin():
	for i in range (amountOfNeuralNetwork):
		lifeOrDie[i] = 0

#Create neural networks within list
for i in range (amountOfNeuralNetwork):
	list_objects.append(Neural_Network())
	lifeOrDie.append(0)




#global parameters
tensorToPredict = []
stillPlayingJS = 0
mateOrNot = 0
def obtainFieldInformation():
	fieldInfo = input("fieldInput; didIWin; stillPlaying_?")
	txt = fieldInfo.split(";")
	tensorToPredict = txt[0].split(",")

	#WATCHOUT NOW IT IS HARDCODED TO BE A TENSOR OF 2D!
	tensorToPredict = torch.tensor(([float(tensorToPredict[0]),float(tensorToPredict[1])]), dtype=torch.float)
	stillPlayingJS = txt[2]
	didIWin = txt[1]


def neuralNetworkMovement(whichNN):
	highestNumb = -1
	counter = -1
	ans = list_objects[whichNN].predict()
	for j in range (len(ans)):
		if ans[j] > highestNumb:
			counter = j+1
			highestNumb = ans[j]
	print('Row-> ' + str(counter))
	print('your turn ;)')
	print('')


def toMateOrNotToMate(whichNN):
	lifeOrDie[whichNN] = mateOrNot


def writeInfoToFile(numb):
	f = open("weightsFile.txt", "a")
	f.write(str(numb) + str(' here we can provide some updates to the file if needed.'))
	f.close()

#play actions
for j in range(batchSize):	
	for i in range (amountOfNeuralNetwork):
		playing = 1
		while(playing):
			#ask field information + still playing
			obtainFieldInformation()

			#check if we are still playing.
			playing = stillPlayingJS

			#create movement for the current neural network
			neuralNetworkMovement(i)

			#save or regard the neuralNetwork
			toMateOrNotToMate(i)

	#Mega Evolve and save the best weights per evolution in file.
	writeInfoToFile(j)

	#evolve
	evolutionFunc()

	#restart process



 







