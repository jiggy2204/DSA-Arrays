import Memory from "./memory";

class Array {
  constructor() {
      //get length of array
    this.length = 0;
    //get size of memory in array
    this._capacity = 0;
    //get address of pointer in memory
    this.ptr = Memory.prototype.allocate(this.length);
  }

  push(value) {
    //Increase memory amount, set value of final block to contain new value
    if (this.length >= this._capacity) {
      this._resize((this.length + 1) * Array.SIZE_RATIO);
    }

    Memory.prototype.set(this.ptr + this.length, value);
    this.length++;
  }

  _resize(size) {
    //current pointer address
    const oldPtr = this.ptr;
    //Get size of current address
    this.ptr = Memory.prototype.allocate(size);

    //Check if current pointer address is empty
    if (this.ptr === null) {
      throw new Error("Out of memory");
    }

    Memory.prototype.copy(this.ptr, oldPtr, this.length);
    Memory.prototype.free(oldPtr);
  }

  get(index) {
    //Add index offset, get value stored at address
    if (index < 0 || index >= this.length) {
      throw new Error("Index error");
    }

    return Memory.prototype.get(this.ptr + index);
  }

  pop() {
    //Remove element at end of array, leave room for next push O(1)
    if (this.length == 0) {
      throw new Error("Index error");
    }

    const value = Memory.prototype.get(this.ptr + this.length - 1);
    this.length--;
    return value;
  }

  insert(index, value) {
    //insert element at address in array
    if (index < 0 || index >= this.length) {
      throw new Error("Index Error");
    }

    if (this.length >= this._capacity) {
      this._resize((this.length + 1) * Array.SIZE_RATIO);
    }

    //Shift all values at new value back 1 position
    Memory.prototype.copy(
      this.ptr + index + 1,
      this.ptr + 1,
      this.index - index
    );

    //Put value in new, correct place
    Memory.prototype.set(this.ptr + index, value);
    this.length++;
  }

  //Removing values is very similar to inserting values, except that you are copying the values backward to fill the space where you removed the value rather than forwards to make space for a new value
  remove(index) {
    if (index < 0 || index >= this.length) {
      throw new Error("Index Error");
    }

    //Shift values over -1 to fill the missing value and index
    Memory.prototype.copy(
      this.ptr + index,
      this.ptr + index + 1,
      this.length - index - 1
    );

    //Shift values over for each index removed
    this.length--;
  }
}

Array.SIZE_RATIO = 3;
