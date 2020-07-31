import numpy as numpy
import torch
import torch.nn as nn

#inp = torch.tensor(([2,9],[1,5],[3,6]), dtype=torch.float) #3x2 tensor
#out = torch.tensor(([92],[100],[89]),dtype=torch.float) #3x1 tensor

#changeable parameters
amountOfNeuralNetwork = 2
batchSize = 2


#ask for the right settings:
print('field settings + playaaah?')
ans = input('field_x: ,  field_y,  howManyOnARow, player1?')
x = ans.split(",")

#Process the right information.
outputSize = int(x[0])
inputSize = int(x[0]) * int(x[1])
winCond = int(x[2])
playerOne = int(x[3])

print(inputSize)
print(winCond)
print(playerOne)

#toPredict = torch.tensor(([4,8]), dtype=torch.float) #1x2 tensor

list_objects = []
lifeOrDie = []

class Neural_Network(nn.Module):
	def __init__(self, ):
		super(Neural_Network, self).__init__()

		#change parameters
		self.inputSize  = inputSize
		self.outputSize = outputSize
		self.hiddenSize = 100
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
		print("predictTensor")
		print(toPredict)
		print('')
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
toPredict = torch.tensor([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], dtype=torch.float)
playing =0
mateOrNot = 0
def obtainFieldInformation(i):
	fieldInfo = input("fieldInput; didIWin; stillPlaying_?")
	txt = fieldInfo.split(";")
	tensorToPredict = txt[0].split(",")
  
    #watch out this is hardcoded part - prone to fail..
	global toPredict
	toPredict = torch.tensor(([float(tensorToPredict[0]),float(tensorToPredict[1]),float(tensorToPredict[2]),float(tensorToPredict[3]),float(tensorToPredict[4]),float(tensorToPredict[5]),float(tensorToPredict[6]),float(tensorToPredict[7]),float(tensorToPredict[8]),float(tensorToPredict[9]),float(tensorToPredict[10]),float(tensorToPredict[11]),float(tensorToPredict[12]),float(tensorToPredict[13]),float(tensorToPredict[14]),float(tensorToPredict[15]),float(tensorToPredict[16]),float(tensorToPredict[17]),float(tensorToPredict[18]),float(tensorToPredict[19]),float(tensorToPredict[20]),float(tensorToPredict[21]),float(tensorToPredict[22]),float(tensorToPredict[23]),float(tensorToPredict[24]),float(tensorToPredict[25]),float(tensorToPredict[26]),float(tensorToPredict[27]),float(tensorToPredict[28]),float(tensorToPredict[29]),float(tensorToPredict[30]),float(tensorToPredict[31]),float(tensorToPredict[32]),float(tensorToPredict[33]),float(tensorToPredict[34]),float(tensorToPredict[35]),float(tensorToPredict[36]),float(tensorToPredict[37]),float(tensorToPredict[38]),float(tensorToPredict[39]),float(tensorToPredict[40]),float(tensorToPredict[41])]), dtype=torch.float)
	print(toPredict)
    
	playing = int(txt[2])
	mateOrNot = int(txt[1])

	toMateOrNotToMate(i, mateOrNot)
	return int(txt[2])-1


def neuralNetworkMovement(whichNN):
	highestNumb = -1
	counter = -1
	ans = list_objects[whichNN].predict()
	for j in range (len(ans)):
		if ans[j] > highestNumb:
			counter = j+1
			highestNumb = ans[j]
	print('Row-> ' + str(counter))
	print('')


def toMateOrNotToMate(whichNN, ans):
	lifeOrDie[whichNN] = ans

def writeInfoToFile(numb):
	f = open("weightsFile.txt", "a")
	f.write(str(numb) + str(' here we can provide some updates to the file if needed.') +str('\n'))
	f.close()


#play actions
for j in range(batchSize):	
	for i in range (amountOfNeuralNetwork):
		#provide info
		print('---------------------------------')
		print(str(i) + '. time for a new neuralNetwork')
		print('')

		while(1):
			#ask field information + still playing
			
           
			#check if we are still playing.
			#does obtainFielInformation
			if(obtainFieldInformation(i)):
				break

			#create movement for the current neural network
			neuralNetworkMovement(i)



	#Mega Evolve and save the best weights per evolution in file.
	writeInfoToFile(j)
	
	#print('evolve')
	#evolve
	evolutionFunc()
	#restart process


print('done with everything.')


 







