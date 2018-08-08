import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Select from 'react-select';
import firebase from "firebase";
import SelectField from "material-ui/SelectField/index";
import MenuItem from "material-ui/MenuItem/index";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';

import './style.css'

class CashCounter extends Component {


    constructor(props) {
        super(props);
        this.state = {
            selectItem: null,
            selectCategory: '',
            value: null,
            quantity: null,
            // items: {}
            orders: [],
            allItems: [{items: 'A'}],
            items: [],
            onlyItems: ['A']
        };
        this.arr = [];
        this.categoryItem();
    }

    saveOrder() {
        var db = firebase.firestore();
        const settings = {timestampsInSnapshots: true};
        db.settings(settings);
        db.collection('orders').add({
            category: this.state.selectCategory,
            items: this.state.value,

        })
    }

    loadItems() {
        var allItems = [];
        var itemArr = [];
        var db = firebase.firestore();
        const settings = {timestampsInSnapshots: true};
        db.settings(settings);
        db.collection('items').get().then((items) => {
            items.forEach((item) => {
                var menu = item.data();
                var items = menu.items;
                // console.log(items);
                menu.id = item.id;
                // items.push(items);
                itemArr.push(menu);
                allItems.push(items);
                this.setState({items: itemArr, allItems: items});
            });
        })
    }

    categoryItem(c) {
        console.log(c);
        var onlyItems = [];
        var db = firebase.firestore();
        const settings = {timestampsInSnapshots: true};
        db.settings(settings);
        c == undefined ? c = this.state.selectCategory : c;
        db.collection('items').where('category', '==', c).get().then((items) => {
            var arr = [];
            items.forEach((item) => {
                var data = item.data();
                data.id = item.id;
                onlyItems.push(data.items);
                arr.push(data);
                this.setState({allItems: arr, onlyItems: onlyItems})
            });
        })
    }

    categoryChange(event, index, value) {
        var category = value;
        console.log(category);
        this.setState({value: value, selectCategory: category});
        console.log(this.state.selectCategory);
        this.categoryItem(value);
    }

    handleChange = value => {
        console.log(value);
        this.setState({itemsObj: value , label: value.label});
    };

    quantityChange(e) {
        var qty = e.target.value;
        this.setState({quantity: qty})
    }

    addOrders() {
        var arr = this.state.orders;
        var items = this.state.itemsObj;
        items.quantity = this.state.quantity;
        arr.push(items);
        console.log(arr);
        this.setState({orders: arr});

    }

    clearField() {
      this.state.value = null;
      this.state.label = null;
      this.state.quantity = null;
        console.log(this.state.value ,this.state.label , this.state.quantity);
    }

    render() {
        const CustomTableCell = withStyles(theme => ({
            head: {
                backgroundColor: theme.palette.common.black,
                color: theme.palette.common.white,
            }, body: {
                fontSize: 14,
            },
        }))(TableCell);
        const suggestions = this.state.allItems.map(suggestion => ({
            label: suggestion.items,
            value: suggestion
        }));
        return (
            <div>
                <AppBar position="static">
                    <Toolbar><Typography variant="title" color="inherit">CashCounter</Typography></Toolbar>
                </AppBar>
                <div style={{marginTop: '10px'}} className='selectField'>
                    <SelectField value={this.state.value} onChange={this.categoryChange.bind(this)}
                                 floatingLabelText='Select Category'>
                        <MenuItem key={1} value={"SNACKS"} primaryText="SNACKS"/>
                        <MenuItem key={2} value={"RICE"} primaryText="RICE"/>
                        <MenuItem key={3} value={"VEGETABLES"} primaryText="VEGETABLES"/>
                        <MenuItem key={4} value={"COMBOS"} primaryText="COMBOS"/>
                        <MenuItem key={5} value={"PIZZA"} primaryText="PIZZA"/>
                    </SelectField><br/>
                </div>
                <div className='select'>
                    <Select options={suggestions} value={this.state.category}
                            onChange={this.handleChange.bind(this)} placeholder="Select Items"/>
                </div>
                <br/>
                <Input className='input' placeholder="Quantity" type="number" value={this.state.quantity}
                       onChange={this.quantityChange.bind(this)} inputProps={{'aria-label': 'Description',}}/>
                <div style={{marginTop: '20px'}}>
                    <Button style={{minWidth: '215px'}} variant="contained" color="primary"
                            onClick={this.addOrders.bind(this)}>Add</Button>
                    <Button style={{minWidth: '215px'}} variant="contained"
                            onClick={this.clearField.bind(this)}>Clear</Button>
                </div>
                <Paper style={{margin: '10px 30px 0 30px'}}>
                    <Table style={{minWidth: '700',}}>
                        <TableHead>
                            <TableRow>
                                <CustomTableCell>Category</CustomTableCell>
                                <CustomTableCell numeric>Items</CustomTableCell>
                                <CustomTableCell numeric>Rate</CustomTableCell>
                                <CustomTableCell numeric>Qty</CustomTableCell>
                                <CustomTableCell numeric>Amount</CustomTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.orders.map(n => {
                                return (
                                    <TableRow key={n.value.id}>
                                        {/*<CustomTableCell component="th" scope="row">Rice</CustomTableCell>*/}
                                        {/*<CustomTableCell numeric>Plain Rice</CustomTableCell>*/}
                                        {/*<CustomTableCell numeric>2</CustomTableCell>*/}
                                        {/*<CustomTableCell numeric>100</CustomTableCell>*/}
                                        {/*<CustomTableCell numeric>{300}</CustomTableCell>*/}
                                        <CustomTableCell component="th" scope="row">{n.value.category}</CustomTableCell>
                                        <CustomTableCell numeric>{n.value.items}</CustomTableCell>
                                        <CustomTableCell numeric>{n.value.price}</CustomTableCell>
                                        <CustomTableCell numeric>{n.quantity}</CustomTableCell>
                                        <CustomTableCell numeric>{n.value.price * n.quantity}</CustomTableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        )
    }
}

export default CashCounter;