var obj = {
	item1: '1'
};

obj.item1 = "2";
obj.item2 = "1";

delete obj.item1;
console.log(obj.item1);
console.log(obj);