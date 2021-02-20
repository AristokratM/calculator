class Calculator {
    static op_rank = {
        "+": 1,
        "-": 1,
        "*": 2,
        "/": 2,
        "^": 3
    }

    constructor(id) {
        self.$out = document.getElementById(id)
        this.getInitSetting()

    }
    getInitSetting() {
        self.$out.innerText = "Enter expression"
        self.displayDefault = true
        this.getDefaultSetting()
    }
    getDefaultSetting() {
        self.numbers_list = new Array()
        self.op_list_1 = new Array()
        self.op_list_2 = new Array()
        self.op_list_3 = new Array()
        self.result = 0
        self.total_op_number = -1
        self.last_number = true
        self.last_op_list = []
        self.last_op_index = -1
        self.can_zero = true
        self.float_number = false
        self.first_zero = false
    }

    clear() {
        this.getInitSetting()
        this.debugDisplay()
    }
    clearDefault() {
        self.$out.innerText = ""
        self.displayDefault = false
    }
    number(id) {
        if (self.displayDefault) {
            this.clearDefault()
        }
        self.last_number = true
        if(self.first_zero) {
            self.$out.innerText = self.$out.innerText.substr(0, self.$out.innerText.length - 1)
        }
        this.addText(id)
        self.can_zero = true
        self.first_zero = false
    }
    zero(id) {
        if(!self.can_zero || self.first_zero) return

        if(!self.last_number || self.displayDefault) {
            self.first_zero = true
        }
        if(self.displayDefault) {
            this.clearDefault()

        }
        this.addText(id)
    }
    make_float(id) {
        if(self.first_zero) {
            self.last_number = true
        } else
        if(!self.last_number  || self.float_number || self.displayDefault) return
        this.addText(id)
        self.float_number = true
        self.first_zero = false
    }
    addText(id) {
        self.$out.innerText += document.getElementById(id).innerText

    }

    operation(id) {
        if (self.displayDefault) {
            return
        }
        if (!self.last_number) {
            self.last_op_list.pop()
            self.$out.innerText = self.$out.innerText.substr(0, self.$out.innerText.length - 1)
            self.total_op_number -= 1
        } else this.addNumber()
        self.total_op_number += 1
        if(self.$out.innerText[self.$out.innerText.length - 1] === '.') {
            self.float_number = false
            self.$out.innerText = self.$out.innerText.substr(0, self.$out.innerText.length - 1)
        }
        const op = document.getElementById(id).innerText
        const item = new Operation({op: op, index: self.total_op_number})
        switch (Calculator.op_rank[op]) {
            case 1:
                self.op_list_1.push(item);
                self.last_op_list = self.op_list_1;
                break
            case 2:
                self.op_list_2.push(item);
                self.last_op_list = self.op_list_2;
                break
            case 3:
                self.op_list_3.push(item);
                self.last_op_list = self.op_list_3;
                break
        }
        self.last_number = false
        self.last_op_index = self.$out.innerText.length
        self.can_zero = true
        self.float_number = false
        this.addText(id)
        this.debugDisplay()
    }

    addNumber() {
        // console.log(self.last_op_index + 1 + " " + self.$out.innerText.length)
        self.numbers_list.push(parseFloat(self.$out.innerText.substr(self.last_op_index + 1, self.$out.innerText.length)))
        this.debugDisplay()
    }
    debugDisplay() {
        document.getElementById("op_list1").innerText = self.op_list_1.toString()
        document.getElementById("op_list2").innerText = self.op_list_2.toString()
        document.getElementById("op_list3").innerText = self.op_list_3.toString()
        document.getElementById("numbers").innerText = self.numbers_list.toString()
    }
    calculate() {
        if(self.last_op_index === self.$out.innerText.length -1 ){
            self.last_op_list.pop()
            self.total_op_number -= 1

        }
        else {
            this.addNumber()
        }
        self.op_list_3.forEach(item=>{
            console.log(item + " 3")
            switch (item.op) {
                case "^":
                    console.log(self.numbers_list)
                    self.numbers_list[item.index] = Math.pow(self.numbers_list[item.index], self.numbers_list[item.index + 1]);
                    self.numbers_list.splice(item.index + 1, 1)
                    console.log(self.numbers_list)
                    break;
            }
        })
        self.op_list_2.forEach(item=>{
            console.log(item + " 2")
            switch (item.op) {
                case "*":
                    self.numbers_list[item.index] *= self.numbers_list[item.index + 1];
                    self.numbers_list.splice(item.index + 1, 1)
                    break;
                case "/":
                    self.numbers_list[item.index] /= self.numbers_list[item.index + 1];
                    self.numbers_list.splice(item.index + 1, 1)
                    break;
            }
        })
        self.op_list_1.forEach(item=>{
            console.log(item + " 1")
            console.log(item.op)
            switch (item.op) {
                case "+":
                    console.log(self.numbers_list)
                    self.numbers_list[item.index] += self.numbers_list[item.index + 1];
                    self.numbers_list.splice(item.index + 1, 1)
                    console.log(self.numbers_list)
                    break
                case "-":
                    self.numbers_list[item.index] -= self.numbers_list[item.index + 1];
                    self.numbers_list.splice(item.index + 1, 1)
                    break
            }
        })
        self.$out.innerText = self.numbers_list[0]
        const float = self.numbers_list[0] % 1 !== 0
        this.getDefaultSetting()
        this.debugDisplay()
        self.float_number = float
    }
}

class Operation {
    constructor(options) {
        this.op = options.op
        this.index = options.index
    }

    toString() {
        return `${this.op}  ${this.index} `
    }
};
const calculator = new Calculator("out")