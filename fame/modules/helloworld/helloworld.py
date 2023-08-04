from fame.core.module import ProcessingModule

class HelloWorld(ProcessingModule):
    name = "HelloWorld"
    description = "output an txt"

    acts_on=[]#none means all type
    generates=["txt"]


    def each(self, target):
        self.add_support_file("output file","helloworld.txt")
        return True