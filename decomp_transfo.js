//----------------------------------------------------------------
//Useful functions
function insert_in_list(elt,liste,index) {
	result=[]
	let i =0;
	while (i<index) {
		result.push(liste[i]);
		i++;
	}
	result.push(elt)
	for (let j=index;j<liste.length;j++) {
		result.push(liste[j]);
	}
	return result;
}

function compute_complete_name(name) {
	let l=name[0];
	let A=name[1];
	let l_0=[];
	let complete_name=A.complete_name;
	if (l.length===1) {
		return [name,l[0].name+"("+complete_name+")"]
	} else {
		let i =0;
		while (i <= l.length-1) {
			if (i===l.length-1 || l[i] != l[i+1]) {
				l_0.push(l[i]);
				complete_name=l[i].name+"("+complete_name+")";
			}
			else {
				i+=1
			}
			i+=1
		}
		return [[l_0.slice(),A],complete_name]
	}
}

function compare_points(point_A,point_B) {
	if (point_A.complete_name === point_B.complete_name) {
		return true
	}
	return false
}

function index_point_in_list(point_A,list_l) {
	for (let i=0;i<list_l.length;i++) {
		if (compare_points(point_A,list_l[i])) {
			return i
		}
	}
	return -1
}

function compareNumbers(a, b) {
  return a - b;
}

function Hudson_test(n,l) {
	let l_test=l.slice();
	let deg_test=n;
	let eps = 0;
	let Hud_test=true;
	while (deg_test != 1 && l_test.length >=3) {
		eps = l_test[0]+l_test[1]+l_test[2]-deg_test;
		if (eps <= 0) {
			Hud_test=false;
			break
		}
		deg_test = deg_test-eps;
		for (let j=0; j<3; j++) {
			l_test[j]=l_test[j]-eps;
			if (l_test[j]<0) {
				deg_test = 1;
			}
		}
		l_test.sort(compareNumbers);
		l_test.reverse();
	}
	if (deg_test != 1) {
		Hud_test = false;
	}
	for (let j=0; j<l_test.length;j++) {
		if (l_test[j] != 0) {
			Hud_test = false;
			break
		}
	}
	return Hud_test
}

//----------------------------------------------------------------


//----------------------------------------------------------------
// Class point
function point(name,point_parent=null) {
	if (typeof name ==="string") {
		this.complete_name=name;
		this.short_name=name;
		this.name = [[],this];
	}
	else {
		let computed_name = compute_complete_name(name);
		this.name = computed_name[0];
		this.complete_name=computed_name[1];
		if (this.name[0].length===0) {
			this.short_name=this.name[1].complete_name;
		} else {
			this.short_name=this.name[1].complete_name+"*";
		}
	}
	
	this.point_parent = point_parent;
	
	if (this.point_parent === null) {
		this.descr = this.short_name+" in P^2 ";
	} else {
		this.descr = this.short_name+" in E_{"+this.point_parent.short_name+"}";
	}
	
	this.actu = function () {
		let name = this.name;
		let point_parent = this.point_parent;
		
		
		if (typeof name ==="string") {
			this.complete_name=name;
			this.short_name=name;
			this.name = [[],this];
		}
		else {
			let computed_name = compute_complete_name(name);
			this.name = computed_name[0];
			this.complete_name=computed_name[1];
			if (this.name[0].length===0) {
				this.short_name=this.name[1].complete_name;
			} else {
				this.short_name=this.name[1].complete_name+"*";
			}
		}
		
		this.point_parent = point_parent;
		
		if (this.point_parent === null) {
			this.descr = this.short_name+" in P^2 ";
		} else {
			this.descr = this.short_name+" in E_{"+this.point_parent.short_name+"}";
		}
		
		
	}

	this.parentize = function(point_parent) {
		this.point_parent=point_parent;
		this.actu();
	}

	this.image_point=function(f) {
		if (index_point_in_list(this,f.base_points) != -1) {
			return this
		}
		let tmp_list_invol = this.name[0].slice();
		tmp_list_invol.push(f);
		let tmp_name = [tmp_list_invol,this.name[1]];
		let Add_to_contracted_line =false;
		let Not_in_line = true;
		let tmp_point_parent = null;
		let parent_index=null;
		if (this.point_parent != null) {
			parent_index = index_point_in_list(this.point_parent,f.base_points);
			if (parent_index != -1) {
				Add_to_contracted_line = true;
			} else {
				tmp_point_parent = this.point_parent.image_point(f);
			}
		} else {
			for (let j=0;j<f.contracted_lines.length;j++) {
				if (index_point_in_list(this,f.contracted_lines[j]) != -1) {
					Not_in_line = false;
					tmp_point_parent = f.base_points[j];
				}
			}
		}
		tmp_return_point = new point(tmp_name,tmp_point_parent);
		
		if (Add_to_contracted_line) {
			f.contracted_lines[parent_index].push(tmp_return_point);
			f.actu();
		}
		
		
		return tmp_return_point
	}
}

// Class invol_quad
function invol_quad(name,base_points,contracted_lines) {
	this.name = name;
	this.base_points = base_points.slice();
	this.contracted_lines = contracted_lines.slice();
	
	this.descr = this.name + " quadratic involution of P^2 with basepoints ";
	for (let i=0;i<this.base_points.length;i++) {
		this.base_points[i].actu();
		this.descr += this.base_points[i].short_name+", ";
	}
	this.descr += "and with contracted lines respectively passing through :\n"
	for (let i=0;i<this.contracted_lines.length - 1; i++) {
		for (j=0; j<this.contracted_lines[i].length;j++) {
			this.descr += this.contracted_lines[i][j].short_name+", ";
		}
		this.descr += "contracted on "+this.base_points[i].short_name+";\n";
	}
	for (let j = 0; j<this.contracted_lines[this.contracted_lines.length - 1].length;j++) {
		this.descr += this.contracted_lines[this.contracted_lines.length - 1][j].short_name+", ";
	}
	this.descr += "contracted on "+this.base_points[this.contracted_lines.length - 1].short_name+".";
	this.type = "invol_quad";
	
	this.actu = function () {
		this.descr = this.name + " quadratic involution of P^2 with basepoints ";
		for (let i=0;i<this.base_points.length;i++) {
			this.base_points[i].actu();
			this.descr += this.base_points[i].short_name+", ";
		}
		this.descr += "and with contracted lines respectively passing through :\\n"
		for (let i=0;i<this.contracted_lines.length - 1; i++) {
			for (let j=0; j<this.contracted_lines[i].length;j++) {
				this.descr += this.contracted_lines[i][j].short_name+", ";
			}
			this.descr += "contracted on "+this.base_points[i].short_name+";\\n";
		}
		for (let j = 0; j<this.contracted_lines[this.contracted_lines.length - 1].length;j++) {
			this.descr += this.contracted_lines[this.contracted_lines.length - 1][j].short_name+", ";
		}
		this.descr += "contracted on "+this.base_points[this.contracted_lines.length - 1].short_name+".";
	}
	
	this.copy = function() {
		return new invol_quad(this.name,this.base_points,this.contracted_lines)
	}
	
	this.change_name = function (name) {
		this.name = name;
	}
	
	}

// Class transfo_plane
function transfo_plane(name,degree,base_points,multiplicities) {
	if (Hudson_test(degree,multiplicities)===false) {
		throw 'The degree and multiplicities do not verify the Hudson test'
	}
	
	this.name = name;
	this.degree = degree;
	
	this.base_points = base_points.slice();
	this.multiplicities = multiplicities.slice();
	
	if (degree===1) {
		this.complexity = 1;
		this.h=-1;
		this.descr=this.name+" birational transformation of P^2 of degree 1.";
	} else {
		this.complexity = this.degree - this.multiplicities[0];
		let j = this.complexity/2;
		let k=0;
		while (k<this.base_points.length-2 && this.multiplicities[k+1]>j) {
			k+=1;
		}
		this.h = k;
		k=0;
		
		this.descr = this.name+" birational transformation of P^2 of degree "+this.degree+" with basepoints: \n";
		for (let i=0; i<this.base_points.length-1;i++) {
			this.base_points[i].actu()
			this.descr += this.base_points[i].descr+" with multiplicity "+this.multiplicities[i]+",\n";
		}
		let last_ind = this.base_points.length-1;
		this.base_points[last_ind].actu();
		this.descr+=this.base_points[last_ind].descr+" with multiplicity "+this.multiplicities[last_ind]+".\n";
	}
	this.type="transfo_plane";
	
	
	this.actu = function() {
		if (degree===1) {
			this.complexity = 1;
			this.h=-1;
			this.descr=this.name+" birational transformation of P^2 of degree 1.";
		} else {
			this.descr = this.name+" birational transformation of P^2 of degree "+this.degree+" with basepoints: \n";
			for (let i=0; i<this.base_points.length-1;i++) {
				this.base_points[i].actu()
				this.descr += this.base_points[i].descr+" with multiplicity "+this.multiplicities[i]+",\n";
			}
			let last_ind = this.base_points.length-1;
			this.base_points[last_ind].actu();
			this.descr+=this.base_points[last_ind].descr+" with multiplicity "+this.multiplicities[last_ind]+".\n";
		}
	}
	
	this.copy = function() {
		return new transfo_plane(this.name,this.degree,this.base_points,this.multiplicities)
	}
	
	this.change_name = function(name) {
		this.name = name;
	}
	
	this.parentize = function(i,j) {
		if (this.multiplicities[i]>this.multiplicities[j] || i===j) {
			throw 'Tried to set O_i in E_{O_j} with either i===j or mult(f,O_i) < mult(f,O_j) :\n.parentize requires mult(f,O_i) < mult(f,O_j)'
		}
		if (j===-1) {
			this.base_points[i].point_parent = null;
		} else {
			this.base_points[i].parentize(this.base_points[j])
		}
		this.base_points[i].actu()
		this.actu()
	}
}

//----------------------------------------------------------------


//----------------------------------------------------------------
function mult(transfo_f,point_A) {
	let index_of_A = index_point_in_list(point_A,transfo_f.base_points);
	if (index_of_A!=-1) {
		if (transfo_f.type==="invol_quad") {
			return 1
		} else {
			return transfo_f.multiplicities[index_of_A]
		}
	} else {
		return 0
	}
}

function compose_quad(transfo_f,invol_g,name) {
	if (invol_g.type != "invol_quad") {
		throw 'The second transformation is not quadratic (invol_quad).'
	}
	if (transfo_f.type ==="invol_quad") {
		tmp = new transfo_plane(transfo_f.name,2,transfo_f.base_points,[1,1,1]);
		return compose_quad(tmp,invol_g,name);
	}
	
	let O=[];
	let O_tmp = [];
	let alpha = [];
	let alpha_tmp = [];
	
	for (let i=0;i<transfo_f.base_points.length;i++) {
		if (index_point_in_list(transfo_f.base_points[i],invol_g.base_points)===-1) {
			O.push(transfo_f.base_points[i].image_point(invol_g));
			alpha.push(transfo_f.multiplicities[i]);
		}
	}
	
	let gamma = transfo_f.degree - mult(transfo_f,invol_g.base_points[0]) - mult(transfo_f,invol_g.base_points[1]) - mult(transfo_f,invol_g.base_points[2]);
	let deg = transfo_f.degree + gamma;
	let new_mult = 0;
	for (let i=0;i<3;i++) {
		new_mult = gamma + mult(transfo_f,invol_g.base_points[i]);
		if (new_mult != 0) {
			O_tmp.push(invol_g.base_points[i]);
			alpha_tmp.push(new_mult);
		}
	}
	
	for (let i =0; i<alpha_tmp.length;i++) {
		let m=alpha.length;
		for (let j=0; j<O.length; j++) {
			if (alpha[j]<alpha_tmp[i]) {
				m=j;
				break
			}
		}
		alpha=insert_in_list(alpha_tmp[i],alpha,m);
		O = insert_in_list(O_tmp[i],O,m);
	}
	return new transfo_plane(name,deg,O,alpha)
}

function partition_sq(s_1,s_2,m,l_tmp,l) {
	for (let a=m;a>0;a+=-1) {
		if (s_1-a>0 && s_2-a*a>0) {
			l_tmp.push(a);
			l=partition_sq(s_1-a,s_2-a*a,a,l_tmp,l);
		} else {
			if (s_1-a===0 && s_2-a*a===0) {
				l_tmp.push(a)
				l.push([])
				for (let i=0;i<l_tmp.length;i++) {
					l[l.length-1].push(l_tmp[i])
				}
				l_tmp.pop();
			}
		}
	}
	if (l_tmp.length != 0) {
		l_tmp.pop()
	}
	return l
}

function compute_homaloidal(degree) {
	l_1 = partition_sq(3*(degree-1),degree*degree-1,Math.trunc(Math.sqrt(degree*degree-1)),[],[]);
	l=[]
	
	for (let i=0;i<l_1.length;i++) {
		if (Hudson_test(degree,l_1[i])) {
			l.push(l_1[i])
		}
	}
	return l
}

function create_transfo_plane(degree,multiplicities,name,symbol="O") {
	if (symbol==="A" || symbol==="B" || symbol==="C") {
		throw 'These symbols are already used in the algorithm of decomposition : A,B,C. Please use another symbol'
	}
	l_f = [];
	for (let i=0;i<multiplicities.length;i++) {
		l_f.push(new point(symbol+"_"+i));
		
	}
	return new transfo_plane(name,degree,l_f,multiplicities)
}

function make_transfo_disjoint(f_input,original_name,count,l=[]) {
	let f=f_input.copy();
	let list_comp=l.slice()
	
	let f_disjoint=true;
	let f_disjoint_0 = true;
	let f_joint = [];
	
	for (let i =1;i<f.h;i++) {
		if (f.base_points[i].point_parent != null) {
			f_disjoint = false;
			if (compare_points(f.base_points[i].point_parent,f.base_points[0])) {
				f_disjoint_0 = false;
			}
		}
	}
	
	if (f_disjoint) {
		return [f,count,list_comp]
	} else {
		let A = new point("A_{"+count+","+original_name+"}");
		let B = new point("B_{"+count+","+original_name+"}");
		let C = null;
		let g = null;
		if (f_disjoint_0 === false) {
			g = new invol_quad(original_name+"_"+list_comp.length,[f.base_points[0],A,B],[[A,B],[f.base_points[0],B],[f.base_points[0],A]]);
			list_comp.push(g);
			f = compose_quad(f,g,"f_"+list_comp.length);
		}
		
		let ind=null;
		f_disjoint = true;
		for (let i=1;i<f.h;i++) {
			if (f.base_points[i].point_parent != null) {
				f_disjoint = false;
				ind = i;
				break
			}
		}
		
		let j=null;
		while (f_disjoint === false) {
			j=ind;
			C = new point("C_{"+count+","+list_comp.length+","+original_name+"}");
			g = new invol_quad(original_name+"_"+list_comp.length,[f.base_points[0],f.base_points[j].point_parent,C],[[f.base_points[j].point_parent,C],[f.base_points[0],C],[f.base_points[0],f.base_points[j].point_parent]]);
			list_comp.push(g);
			f = compose_quad(f,g,"f_{"+count+","+list_comp.length+"}");
			f_disjoint = true;
			for (let i=1;i<f.h;i++) {
				if (f.base_points[i].point_parent != null) {
					f_disjoint = null;
					ind = i;
					break
				}
			}
		}
		return [f,count+1,list_comp]
	}
}

function decomp_transfo_rec(f_input,original_name,count=0,l_input=[]) {
	let l=l_input.slice();
	let make_disj = make_transfo_disjoint(f_input,original_name,count,l);
	if (make_disj[0].degree==2) {
		return make_disj
	}
	let g = new invol_quad(original_name+"_"+make_disj[2].length,[make_disj[0].base_points[0],make_disj[0].base_points[1],make_disj[0].base_points[2]],[[make_disj[0].base_points[1],make_disj[0].base_points[2]],[make_disj[0].base_points[0],make_disj[0].base_points[2]],[make_disj[0].base_points[0],make_disj[0].base_points[1]]]);
	
	make_disj[2].push(g);
	make_disj[0] = compose_quad(make_disj[0],g,"f_"+make_disj[2].length);
	make_disj = decomp_transfo_rec(make_disj[0],original_name,make_disj[1],make_disj[2]);
	return make_disj
}

function decomp_transfo(f_input) {
	let make_disj = decomp_transfo_rec(f_input,f_input.name,0,[]);
	make_disj[2].push(new invol_quad(f_input.name+"_"+make_disj[2].length,[make_disj[0].base_points[0],make_disj[0].base_points[1],make_disj[0].base_points[2]],[[make_disj[0].base_points[1],make_disj[0].base_points[2]],[make_disj[0].base_points[0],make_disj[0].base_points[2]],[make_disj[0].base_points[0],make_disj[0].base_points[1]]]));
	make_disj[2].reverse();
	return make_disj[2]
}
//----------------------------------------------------------------

const Forbidden = {list : [""]};
const ValidChar = {list : []}
for (i=48;i<58;i++) {
	ValidChar.list.push(String.fromCharCode(i));
}
for (i=0;i<27;i++) {
	ValidChar.list.push(String.fromCharCode(65+i));
	ValidChar.list.push(String.fromCharCode(97+i));
}
const Homal = {chosenMult : null};
const ComputedTransfo = {list : []};
const ComputedResol = {list : []};


//----------------------------------------------------------------
//----------------- HTML Constants -------------------------------
//----------------------------------------------------------------

//------- Create transformation -------

const nameField = document.querySelector('.nameField');
const Err_name = document.getElementById('Err_name');
const symbolField = document.querySelector('.symbolField');
const Err_symb = document.getElementById('Err_symb');

const degreeField = document.querySelector('.degreeField');
const degree = document.querySelector('.degree');

const Multiplicities = document.querySelector('.Multiplicities');
const Err_mult = document.getElementById('Err_mult');
const computeTransfo = document.querySelector('.computeTransfo');

const transformationDescr = document.querySelector('.transformationDescr');
const transformationBasepoints=document.querySelector('.transformationBasepoints');

const basePoints = document.querySelector('.basePoints');
basePoints.disabled=true;
const exceptionalDivisors = document.querySelector('.exceptionalDivisors');
exceptionalDivisors.disabled=true;

const addTransfo = document.querySelector('.addTransfo');
addTransfo.disabled=true;

//------- Compose transformation -------

const nameCompositionField = document.querySelector('.nameCompositionField');
const Err_name_composition = document.getElementById('Err_name_composition');

const printComposition = document.querySelector('.printComposition');
const Err_compose = document.getElementById('Err_compose');

const mainTransfo = document.querySelector('.mainTransfo');
const subTransfo = document.querySelector('.subTransfo');

const removeLast = document.querySelector('.removeLast');
removeLast.disabled = true;
const computeCompositionsButton = document.querySelector('.computeCompositionsButton');
computeCompositionsButton.disabled = true;

//------- Transformation Details ------

const listTransfoPrint = document.querySelector('.listTransfoPrint');
const degreePrint = document.querySelector('.degreePrint');

const basePointsPrint = document.querySelector('.basePointsPrint');

const decompDescr = document.querySelector('.decompDescr');
const decompFormula = document.querySelector('.decompFormula');

const decompDetails = document.querySelector('.decompDetails');

//----------------------------------------------------------------
//----------------- Computation ----------------------------------
//----------------------------------------------------------------

function stringToList(str) {
	comp_list =[];
	tmp = "";
	index = 0;
	while (index < str.length) {
		if (str[index] === "," || str[index] === ";") {
			comp_list.push(Number(tmp));
			tmp="";
			index++;
		} else {
			tmp += str[index];
			index++;
		}
	}
	comp_list.push(Number(tmp));
	return comp_list
}

function stringShape(str_input) {
	let str = String(str_input)
	let res = document.createElement('span');
	let tmp = "";
	let modShortName = false;
	let index = -1;
	for (i=0;i<str.length;i++) {
		if (str[i]==="_") {
			index = i;
			break
		}
		tmp += str[i];
	}
	res.appendChild(document.createTextNode(tmp));
	if (index != -1) {
		console.log(true)
		let subStr = document.createElement('sub');
		tmp ="";
		if (str[index+1]==="{") {
			for (i=index+2;i<str.length-1;i++) {
				tmp += str[i];
			}
		} else {
			if (str[str.length-1] === "*") {
				modShortName = true;
				for (let i=index+1;i<str.length-1;i++) {
					tmp += str[i];
				}
			} else {
				for (let i=index+1;i<str.length;i++) {
					tmp += str[i];
				}
			}
		}
		subStr.appendChild(stringShape(tmp));
		res.appendChild(subStr);
		if (modShortName) {
			res.appendChild(document.createTextNode("*"))
		}
		
		
	}
	return res
}

function createBasePointTable(f) {
	
	let tableBasePoints = document.createElement('table');
	let tableBasePoints_coln = document.createElement('td');
	let tableBasePoints_coln_content = document.createElement('table');
	let tableBasePoints_coln_content_line = document.createElement('tr');
	let tableBasePoints_coln_div = null;
	
	//First column
	let cell = document.createElement('td')
	cell.appendChild(document.createTextNode("Name"))
	tableBasePoints_coln_content_line.appendChild(cell)
	tableBasePoints_coln_content.appendChild(tableBasePoints_coln_content_line);
	
	tableBasePoints_coln_content_line = document.createElement('tr');
	cell = document.createElement('td')
	cell.appendChild(document.createTextNode("Multiplicity"))
	cell.title = f.multiplicities;
	tableBasePoints_coln_content_line.appendChild(cell);
	tableBasePoints_coln_content.appendChild(tableBasePoints_coln_content_line);
	
	tableBasePoints_coln_content_line = document.createElement('tr');
	cell = document.createElement('td');
	cell.appendChild(document.createTextNode("Location"));
	tableBasePoints_coln_content_line.appendChild(cell);
	tableBasePoints_coln_content.appendChild(tableBasePoints_coln_content_line);

	tableBasePoints_coln.appendChild(tableBasePoints_coln_content);
	tableBasePoints.appendChild(tableBasePoints_coln);
	
	//Second column
	tableBasePoints_coln = document.createElement('td');
	tableBasePoints_coln_div = document.createElement('div');
	tableBasePoints_coln_div.setAttribute('class','tableBasePointsDiv');
	tableBasePoints_coln_content = document.createElement('table');
	tableBasePoints_coln_content_line = document.createElement('tr');
	
	for (let i=0;i<f.base_points.length;i++) {
		cell = document.createElement('td');
		cell.appendChild(stringShape(f.base_points[i].short_name));
		cell.title = f.base_points[i].complete_name;
		tableBasePoints_coln_content_line.appendChild(cell);
	}
	tableBasePoints_coln_content.appendChild(tableBasePoints_coln_content_line);
	
	tableBasePoints_coln_content_line = document.createElement('tr');
	for (i=0;i<f.base_points.length;i++) {
		cell = document.createElement('td');
		cell.appendChild(document.createTextNode(f.multiplicities[i]));
		tableBasePoints_coln_content_line.appendChild(cell);
	}
	
	tableBasePoints_coln_content.appendChild(tableBasePoints_coln_content_line);
	tableBasePoints_coln_content_line = document.createElement('tr');
	for (let i=0;i<f.base_points.length;i++) {
		cell = document.createElement('td');
		if (f.base_points[i].point_parent === null) {
			cell.appendChild(document.createTextNode("-"));
		} else {
			cell.appendChild(stringShape("E_{"+f.base_points[i].point_parent.short_name+"}"));
			cell.title = f.base_points[i].point_parent.complete_name;
		}
		tableBasePoints_coln_content_line.appendChild(cell);
	}
	tableBasePoints_coln_content.appendChild(tableBasePoints_coln_content_line);
	tableBasePoints_coln_div.appendChild(tableBasePoints_coln_content);
	tableBasePoints_coln.appendChild(tableBasePoints_coln_div);
	tableBasePoints.appendChild(tableBasePoints_coln);
	tableBasePoints.setAttribute('class','tableBasePoints');
	return tableBasePoints;
}

function checkValid(str) {
	res = true;
	if (str.length >10 || Forbidden.list.indexOf(str) != -1) {
		res = false;
	} else {
		for (i=0;i<str.length;i++) {
			if (ValidChar.list.indexOf(str[i])===-1) {
				res = false;
				break
			}
		}
	}
	return res;
}

//------- Create transformation -------


function printMultiplicities() {
	Multiplicities.innerHTML = "";//Empties the select
	Err_mult.textContent = "";
	let enteredDegree = Number(degreeField.value);
	let listMultiplicities = null;
	if (enteredDegree <31) {
		listMultiplicities = document.createElement('select');
		degree.textContent = "Here are the possible multiplicities for a transformation of degree "+enteredDegree+" :";
		
		Homal.computedMult = compute_homaloidal(enteredDegree);
		let optionMult=null;
		for (let i=0;i<Homal.computedMult.length;i++) {
			optionsMult = document.createElement('option');
			optionsMult.text="";
			for (let j=0;j<Homal.computedMult[i].length-1;j++) {
				optionsMult.text+=Homal.computedMult[i][j]+", ";
			}
			optionsMult.text+=Homal.computedMult[i][Homal.computedMult[i].length-1];
			listMultiplicities.add(optionsMult, null);
		}
		Multiplicities.appendChild(listMultiplicities);
	} else {
		listMultiplicities = document.createElement('input');
		listMultiplicities.type="text";
		degree.textContent = "List of multiplicities :";
		degree.title = "Automatic computation does not work for degrees above 31";
		Multiplicities.appendChild(listMultiplicities);
	}
	
	
}

function computeTransformation() {
	transformationBasepoints.innerHTML = "";//Empties the list
	transformationDescr.textContent="";
	Err_name.textContent = "";
	Err_symb.textContent = "";
	Err_mult.textContent = "";
	let allowCreation=true;
	let f = null;
	if (checkValid(String(nameField.value)) === false) {
		Err_name.textContent = "Invalid or already used name.";
		allowCreation=false;
	}
	if (checkValid(String(symbolField.value)) === false) {
		Err_symb.textContent = "Invalid or already used symbol.";
		allowCreation=false;
	}
	if (allowCreation) {
		let enteredDegree = Number(degreeField.value);
		if (enteredDegree < 31) {
			let index = Multiplicities.firstChild.selectedIndex;
			f = create_transfo_plane(Number(degreeField.value),Homal.computedMult[index],String(nameField.value),String(symbolField.value));
		} else {
			let list_mult = stringToList(String(Multiplicities.firstChild.value));
			if (Hudson_test(enteredDegree,list_mult)===false) {
				Err_mult.textContent = "Hudson test not verified.";
				allowCreation=false;
			} else {
				f = create_transfo_plane(Number(degreeField.value),list_mult,String(nameField.value),String(symbolField.value));
			}
		}
		
		if (allowCreation) {
			Forbidden.list.push(nameField.value);
			Forbidden.list.push(symbolField.value);
			
			nameField.disabled=true;
			symbolField.disabled=true;
			degreeField.disabled=true;
			Multiplicities.firstChild.disabled=true;
			computeTransfo.disabled=true;
			
			basePoints.disabled=false;
			exceptionalDivisors.disabled=false;
			addTransfo.disabled = false;
			
			ComputedTransfo.list.push(f);
			
			let optionBasePoint = null;
			for (i=0;i<f.base_points.length;i++) {
				optionBasePoint = document.createElement('option');
				optionBasePoint.text = f.base_points[i].short_name;
				basePoints.add(optionBasePoint, null);
			}
			
			computeExceptionalDivisors();
			
		}
		
	}
}

function computeExceptionalDivisors() {
	
	transformationBasepoints.innerHTML = "";//Empties the list
	exceptionalDivisors.innerHTML = "";//Empties the select
	transformationDescr.textContent="";
	
	let f = ComputedTransfo.list[ComputedTransfo.list.length-1];
	
	let optionExceptionalDivisor = null;
	let index = basePoints.selectedIndex;
	let checkIfAlreadyParent = false;
	for (let i=0;i<index;i++) {
		checkIfAlreadyParent = false;
		for (let j=0;j<f.base_points.length;j++) {
			if (f.base_points[j].point_parent != null && compare_points(f.base_points[i],f.base_points[j].point_parent)) {
				checkIfAlreadyParent = true;
				break
			}
		}
		optionExceptionalDivisor = document.createElement('option');
		optionExceptionalDivisor.text = "E_{"+f.base_points[i].short_name+"}";
		if (checkIfAlreadyParent) {
			optionExceptionalDivisor.disabled=true;
		}
		exceptionalDivisors.add(optionExceptionalDivisor);
	}
	optionExceptionalDivisor = document.createElement('option');
	optionExceptionalDivisor.text = "P^2";
	exceptionalDivisors.add(optionExceptionalDivisor);
	
	if (f.base_points[index].point_parent === null) {
		exceptionalDivisors.selectedIndex = exceptionalDivisors.length-1;
	} else {
		exceptionalDivisors.selectedIndex = index_point_in_list(f.base_points[index].point_parent,f.base_points);
	}
	
	//
	
	transformationDescr.textContent = "You created the transformation "+f.name+" of degree "+f.degree+" and with basepoints :"
	transformationBasepoints.appendChild(createBasePointTable(f));
	
}

function refreshTransfo() {
	transformationBasepoints.innerHTML = "";//Empties the list
	transformationDescr.textContent="";
	if (exceptionalDivisors.selectedIndex === exceptionalDivisors.length-1) {
		ComputedTransfo.list[ComputedTransfo.list.length-1].parentize(basePoints.selectedIndex,-1);
	} else {
		ComputedTransfo.list[ComputedTransfo.list.length-1].parentize(basePoints.selectedIndex,exceptionalDivisors.selectedIndex);
	}
	let f = ComputedTransfo.list[ComputedTransfo.list.length-1];
	
	transformationDescr.textContent = "You created the transformation "+f.name+" of degree "+f.degree+" and with basepoints :"
	transformationBasepoints.appendChild(createBasePointTable(f));
}

function addComputedTransfo() {
	ComputedResol.list.push(decomp_transfo(ComputedTransfo.list[ComputedTransfo.list.length-1]));
	for (let i=0;i<ComputedResol.list[ComputedResol.list.length-1].length;i++) {
		Forbidden.list.push(ComputedResol.list[ComputedResol.list.length-1][i].name);
	}
	
	refreshComposeMainTransfo();
	refreshComposeSubTransfo();
	refreshListTransfoPrint();
	
	addTransfo.disabled=true;
	exceptionalDivisors.disabled=true;
	basePoints.disabled=true;
	
	transformationBasepoints.innerHTML = "";
	transformationDescr.textContent="";
	exceptionalDivisors.innerHTML = "";
	basePoints.innerHTML = "";
	computeTransfo.disabled=false;
	Multiplicities.innerHTML = ""; Multiplicities.disabled = false;
	degree.textContent = "";
	degreeField.value=""; degreeField.disabled=false;
	symbolField.value=""; symbolField.disabled=false;
	nameField.value=""; nameField.disabled=false;
}

degreeField.addEventListener('change', printMultiplicities);
computeTransfo.addEventListener('click', computeTransformation);
basePoints.addEventListener('change', computeExceptionalDivisors);
exceptionalDivisors.addEventListener('change',refreshTransfo);
addTransfo.addEventListener('click',addComputedTransfo);

//------- Compose transformation -------

const Composition = {list : []}

function refreshComposeMainTransfo() {
	mainTransfo.innerHTML = "";
	let optionMainTransfo = null;
	for (i=0;i<ComputedTransfo.list.length;i++) {
		optionMainTransfo = document.createElement('option');
		optionMainTransfo.text = ComputedTransfo.list[i].name;
		mainTransfo.add(optionMainTransfo)
	}
}

function refreshComposeSubTransfo() {
	subTransfo.innerHTML = "";
	let optionSubTransfo = document.createElement('option');
	optionSubTransfo.text = ComputedTransfo.list[mainTransfo.selectedIndex].name;
	optionSubTransfo.addEventListener('click',addToCompose);
	subTransfo.add(optionSubTransfo);
	
	for (let i=0;i<ComputedResol.list[mainTransfo.selectedIndex].length;i++) {
		optionSubTransfo = document.createElement('option');
		optionSubTransfo.text = ComputedResol.list[mainTransfo.selectedIndex][i].name;
		optionSubTransfo.addEventListener('click',addToCompose);
		subTransfo.add(optionSubTransfo);
	}
}

function addToCompose() {
	if (subTransfo.selectedIndex === 0) {
		Composition.list.push([ComputedTransfo.list[mainTransfo.selectedIndex],mainTransfo.selectedIndex]);
		printComposition.textContent += ComputedTransfo.list[mainTransfo.selectedIndex].name+", ";
	} else {
		Composition.list.push([ComputedResol.list[mainTransfo.selectedIndex][subTransfo.selectedIndex-1],null]);
		printComposition.textContent += ComputedResol.list[mainTransfo.selectedIndex][subTransfo.selectedIndex-1].name+", "
	}
	removeLast.disabled = false;
	computeCompositionsButton.disabled=false;
}

function removeLastComposite() {
	if (Composition.list.length != 0) {
		printComposition.textContent = printComposition.textContent.substring(0,printComposition.textContent.length - Composition.list[Composition.list.length-1][0].name.length - 2);
		Composition.list.pop();
	}
	if (Composition.list.length===0) {
		computeCompositionsButton.disabled=true;
		removeLast.disabled=true;
	}
}

function computeComposition() {
	
	
	let allowCreation=true;
	if (Forbidden.list.indexOf(String(nameCompositionField.value)) != -1) {
		Err_name_composition.textContent = "Invalid or already used name.";
		allowCreation=false;
	}
	if (Composition.list.length <2) {
		Err_compose.textContent = "At least 2 transformations are required.";
		allowCreation=false;
	}
	if (allowCreation) {
		Err_name_composition.textContent = "";
		Err_compose.textContent = "";
		nameCompositionField.disabled = true;
		mainTransfo.disabled = true;
		subTransfo.disabled=true;
		removeLast.disabled=true;
		computeCompositionsButton.disabled = true;
		
		let name = String(nameCompositionField.value);
		Forbidden.list.push(name);
		let tmp = [];
		for (let i=0;i<Composition.list.length;i++) {
			if (Composition.list[i][0].type==="transfo_plane") {
				for (let j=0;j<ComputedResol.list[Composition.list[i][1]].length;j++) {
					tmp.push(ComputedResol.list[Composition.list[i][1]][j]);
				}
			} else {
				tmp.push(Composition.list[i][0]);
			}
		}
		let f = tmp[0];
		for (i=1;i<tmp.length;i++) {
			f = compose_quad(f,tmp[i],name);
		}
		ComputedTransfo.list.push(f);
		ComputedResol.list.push(tmp);
		
		refreshComposeMainTransfo();
		refreshComposeSubTransfo();
		refreshListTransfoPrint();
		
		Composition.list = [];
		printComposition.textContent = "Compose : ";
		nameCompositionField.value = ""; nameCompositionField.disabled = false;
		mainTransfo.disabled = false;
		subTransfo.disabled=false;
		removeLast.disabled=false;
		computeCompositionsButton.disabled = false;
	}
}

mainTransfo.addEventListener('change',refreshComposeSubTransfo);
removeLast.addEventListener('click',removeLastComposite);
computeCompositionsButton.addEventListener('click',computeComposition);

//------- Transformation Details ------



function refreshListTransfoPrint() {
	listTransfoPrint.innerHTML = "";
	let optionListTransfoPrint = null;
	for (i=0;i<ComputedTransfo.list.length;i++) {
		optionListTransfoPrint = document.createElement('option');
		optionListTransfoPrint.text = ComputedTransfo.list[i].name;
		listTransfoPrint.add(optionListTransfoPrint)
	}
	
	refreshTransfoDetails();
}

function refreshTransfoDetails() {
	decompDetails.innerHTML = "";
	decompFormula.innerHTML = "";
	basePointsPrint.innerHTML = "";
	let f = ComputedTransfo.list[listTransfoPrint.selectedIndex];
	let resol = ComputedResol.list[listTransfoPrint.selectedIndex];
	degreePrint.textContent = "Birational transformation of degree "+f.degree+" with basepoints :";
	
	basePointsPrint.appendChild(createBasePointTable(f));
	
	
	
	decompDescr.textContent = "The decomposition of "+f.name+" in quadratic involutions is given by :";
	decompFormula.appendChild(document.createTextNode(f.name+" = "));
	for (let i=0;i<resol.length;i++) {
		decompFormula.appendChild(document.createTextNode("("));
		decompFormula.appendChild(stringShape(resol[i].name));
		decompFormula.appendChild(document.createTextNode(") "));
	}
	
	let decompDetailsTable = document.createElement('table')
	let decompDetailTable_line = null;
	
	let involDetails = null;
	let involDetails_coln = null;
	let involDetails_coln_line = null;
	
	let f_tmp = f;
	let f_resol = null;
	let i = 0;
	for (j=0;j<resol.length;j++) {
		i = resol.length-1-j;
		f_resol = resol[i];
		
		decompDetailTable_line = document.createElement('tr');
			decompDetailTable_line.appendChild(createBasePointTable(f_tmp));
			decompDetailsTable.appendChild(decompDetailTable_line);
		
		if (j!=resol.length-1) {
		decompDetailTable_line = document.createElement('tr');
			involDetails = document.createElement('table');
				involDetails_coln = document.createElement('td');
				involDetails_coln.appendChild(document.createTextNode("↓"));
				involDetails.appendChild(involDetails_coln);
			
				involDetails_coln = document.createElement('td');
				// involDetails_coln.appendChild(document.createTextNode(f_resol.name));
				involDetails_coln.appendChild(stringShape(f_resol.name));
				involDetails_coln.appendChild(document.createTextNode(" with basepoints "));
				involDetails.appendChild(involDetails_coln);
				
				involDetails_coln = document.createElement('td');
					involDetails_coln_line = document.createElement('td');
						involDetails_coln_line.appendChild(stringShape(f_resol.base_points[0].short_name+", "));
						involDetails_coln_line.title = f_resol.base_points[0].complete_name;
					involDetails_coln.appendChild(involDetails_coln_line);
					involDetails_coln_line = document.createElement('td');
						involDetails_coln_line.appendChild(stringShape(f_resol.base_points[1].short_name+", "));
						involDetails_coln_line.title = f_resol.base_points[1].complete_name;
					involDetails_coln.appendChild(involDetails_coln_line);
					involDetails_coln_line = document.createElement('td');
						involDetails_coln_line.appendChild(stringShape(f_resol.base_points[2].short_name+"."));
						involDetails_coln_line.title = f_resol.base_points[2].complete_name;
					involDetails_coln.appendChild(involDetails_coln_line);
				involDetails.appendChild(involDetails_coln);
			decompDetailTable_line.appendChild(involDetails);
		decompDetailsTable.appendChild(decompDetailTable_line);
		}
		
		f_tmp = compose_quad(f_tmp,f_resol);

	}
	decompDetails.appendChild(decompDetailsTable);
}

listTransfoPrint.addEventListener('change',refreshTransfoDetails);
