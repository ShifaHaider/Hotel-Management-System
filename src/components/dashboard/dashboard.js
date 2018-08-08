import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import TextField from '@material-ui/core/TextField';
import MenuItem from 'material-ui/MenuItem';
import firebase from 'firebase'
import {GridList, GridTile} from 'material-ui/GridList';
import {List, ListItem} from 'material-ui/List';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {withStyles} from '@material-ui/core/styles';
import Items from './items'

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            value: null,
            selectCategory: '',
            itemArr: [],
            items: '',
            id: '',
            price : null,
            serialNo: null
        };

        this.db = firebase.firestore();
        const settings = {timestampsInSnapshots: true};
        this.db.settings(settings);
        // this.loadItems();
    }

    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
        console.log(this.state.serialNo);
    };

    categoryChange(event, index, value) {
        var category = event.target.textContent;
        this.setState({value: value, selectCategory: category});

    }

    itemChange(e) {
        var items = e.target.value;
        this.setState({items: items});
        this.loadCategory();
    }

    priceChange(e) {
        var price = e.target.value;
        this.setState({price: price});
    }

    saveItems() {

        this.db = firebase.firestore();
        const settings = {timestampsInSnapshots: true};
        this.db.settings(settings);
        console.log(this.state.serialNo);
        // console.log(++this.state.serialNo);

        this.db.collection('items').add({
            category: this.state.selectCategory,
            items: this.state.items,
            serialNo : this.state.selectCategory[0] + '.' + ++this.state.serialNo,
            price: this.state.price,
            time: Date.now()
        });
        console.log(this.state.serialNo);
        this.setState({open: false});
    }

    loadCategory(){
        var arr = [];
        this.db = firebase.firestore();
        const settings = {timestampsInSnapshots: true};
        this.db.settings(settings);
        var category = this.state.selectCategory;
        this.db.collection('items').where('category', '==', category).onSnapshot((items)=>{
                items.docChanges().forEach((fixedCategoryItem)=>{
                    var fixedCategory = fixedCategoryItem.doc.data();
                    arr.push(fixedCategory);
                    var serialNo =  arr[0].serialNo;
                    var serial  = serialNo.split('');
                    var num =  serial[serial.length - 1];
                    this.setState({serialNo: num})
                });
            console.log(arr);
            console.log(arr[0]);
            console.log(this.state.serialNo);
        })
    }
    loadItems(){
        var arr = [];
        var db = firebase.firestore();
        const settings = {timestampsInSnapshots: true};
        db.settings(settings);
        db.collection('items').onSnapshot((items)=>{
            items.docChanges().forEach((item)=>{
                var menu = item.doc.data();
                var id = item.doc.id;
                menu.id = item.doc.id;
                arr.push(menu);
                this.setState({itemArr: arr , id : id});
            })
        })
    }

    items(){
        this.props.history.push('/items');
    }

    render() {
        const CustomTableCell = withStyles(theme => ({
            head: {
                backgroundColor: theme.palette.common.black,
                color: theme.palette.common.white,
            },
            body: {
                fontSize: 14,
            },
        }))(TableCell);
        const actions = [
            <Button color='primary' onClick={this.handleClose}>Cancel</Button>,
            <Button color='primary' onClick={this.saveItems.bind(this)}>Add</Button>];
        return (
            <div>
                <AppBar position="static">
                    <Toolbar><Typography variant="title" color="inherit">Dashboard</Typography></Toolbar>
                </AppBar>
                <div style={{position: 'fixed', right: '10px', bottom: '16px'}}>
                    <Button variant="fab" color="primary" aria-label="add" onClick={this.handleOpen} className='button'>
                        <AddIcon/>
                    </Button>
                </div>
                <Dialog actions={actions} modal={false} open={this.state.open} onRequestClose={this.handleClose}>
                    <SelectField value={this.state.value} floatingLabelText="Select Category"
                                 onChange={this.categoryChange.bind(this)} fullWidth={true}>
                        <MenuItem key={1} value={1} primaryText="SNACKS"/>
                        <MenuItem key={2} value={2} primaryText="RICE"/>
                        <MenuItem key={3} value={3} primaryText="VEGETABLES"/>
                        <MenuItem key={4} value={4} primaryText="COMBOS"/>
                        <MenuItem key={5} value={5} primaryText="PIZZA"/>
                    </SelectField><br/>
                    <TextField label='Item' fullWidth={true} value={this.state.items} onChange={this.itemChange.bind(this )}/><br/>
                    <TextField label='Price' type='number' fullWidth={true} value={this.state.price} onChange={this.priceChange.bind(this)}/><br/>
                </Dialog>
                <GridList cols={4} cellHeight='auto'>
                    <GridTile cols={1}>
                        <List style={{borderRight: '3px solid #3f51b5',}}>
                            <ListItem onClick={this.loadItems.bind(this)}>Items</ListItem>
                            <ListItem>Orders</ListItem>
                        </List>
                    </GridTile>
                    <GridTile cols={3}>
                        {this.state.id ? <Items/>: <h1>Hello</h1>}
                    </GridTile>
                </GridList>
            </div>
        )
    }
}

export default Dashboard;