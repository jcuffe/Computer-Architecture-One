/**
 * LS-8 v2.0 emulator skeleton code
 */

const instructions = {
    0b10101000: 'ADD',
    0b10110011: 'AND',
    0b01001000: 'CALL',
    0b10100000: 'CMP',
    0b01111001: 'DEC',
    0b10101011: 'DIV',
    0b00000001: 'HLT',
    0b01111000: 'INC',
    0b01001010: 'INT',
    0b00001011: 'IRET',
    0b01010001: 'JEQ',
    0b01010100: 'JGT',
    0b01010011: 'JLT',
    0b01010000: 'JMP',
    0b01010010: 'JNE',
    0b10011000: 'LD',
    0b10011001: 'LDI',
    0b10101100: 'MOD',
    0b10101010: 'MUL',
    0b00000000: 'NOP',
    0b01110000: 'NOT',
    0b10110001: 'OR',
    0b01001100: 'POP',
    0b01000010: 'PRA',
    0b01000011: 'PRN',
    0b01001101: 'PUSH',
    0b00001001: 'RET',
    0b10011010: 'ST',
    0b10101001: 'SUB',
    0b10110010: 'XOR'
}

/**
 * Class for simulating a simple Computer (CPU & memory)
 */
class CPU {

    /**
     * Initialize the CPU
     */
    constructor(ram) {
        this.ram = ram;

        this.reg = new Array(8).fill(0); // General-purpose registers R0-R7
        
        // Special-purpose registers
        this.PC = 0; // Program Counter
    }
    
    /**
     * Store value in memory address, useful for program loading
     */
    poke(address, value) {
        this.ram.write(address, value);
    }

    /**
     * Starts the clock ticking on the CPU
     */
    startClock() {
        this.clock = setInterval(() => {
            this.tick();
        }, 1); // 1 ms delay == 1 KHz clock == 0.000001 GHz
    }

    /**
     * Stops the clock
     */
    stopClock() {
        clearInterval(this.clock);
    }

    /**
     * ALU functionality
     *
     * The ALU is responsible for math and comparisons.
     *
     * If you have an instruction that does math, i.e. MUL, the CPU would hand
     * it off to it's internal ALU component to do the actual work.
     *
     * op can be: ADD SUB MUL DIV INC DEC CMP
     */
    alu(op, regA, regB) {
        switch (op) {
            case 'MUL':
                const lval = this.ram.read(regA)
                const rval = this.ram.read(regB)
                this.ram.write(regA, lval * rval)
                break;
        }
    }

    /**
     * Advances the CPU one cycle
     */
    tick() {
        // Load the instruction register (IR--can just be a local variable here)
        // from the memory address pointed to by the PC. (I.e. the PC holds the
        // index into memory of the instruction that's about to be executed
        // right now.)

        const IR = this.ram.read(this.PC)

        // Debugging output
        // console.log(`${this.PC}: ${IR.toString(2)}`);

        // Get the two bytes in memory _after_ the PC in case the instruction
        // needs them.

        const b1 = this.ram.read(this.PC + 1)
        const b2 = this.ram.read(this.PC + 2)

        // Execute the instruction. Perform the actions for the instruction as
        // outlined in the LS-8 spec.

        const instruction = instructions[IR]
        this[instruction](b1, b2)

        // Increment the PC register to go to the next instruction. Instructions
        // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
        // instruction byte tells you how many bytes follow the instruction byte
        // for any particular instruction.
        
        // Increment PC by 1 + the value of the two leftmost bits of the instruction
        this.PC += ((IR & 0b11000000) >> 6) + 1
        // console.log(`new PC: ${this.PC}`)
    }

    // Handler functions for all operations
    LDI(b1, b2) {
        // console.log(`LDI ${b1} ${b2}`)
        this.ram.write(b1, b2)
    }

    MUL(b1, b2) {
        this.alu('MUL', b1, b2)
    }

    PRN(b1) {
        // console.log(`PRN ${b1}`)
        console.log(this.ram.read(b1))
    }

    HLT() {
        // console.log('HLT')
        this.stopClock()
    }
}

module.exports = CPU;
