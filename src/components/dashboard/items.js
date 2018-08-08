import React, {Component} from 'react';
import firebase from "firebase";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {GridTile} from "material-ui/GridList/index";


class Items extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: []
        };
        this.loadItems();
        this.db = firebase.firestore();
        const settings = {timestampsInSnapshots: true};
        this.db.settings(settings);
    }


    componentWillReceiveProps(nextProps) {
        console.log(nextProps.items);
        // this.setState({items: nextProps.items});
    }

    loadItems() {
        var arr = [];
        this.db = firebase.firestore();
        const settings = {timestampsInSnapshots: true};
        this.db.settings(settings);
        this.db.collection('items').onSnapshot((items) => {
            items.docChanges().forEach((item) => {
                console.log(item);
                var menu = item.doc.data();
                console.log(item.doc.data().serialNo);
                menu.id = item.doc.id;
                arr.unshift(menu);
                this.setState({items: arr});
                console.log(menu);
            })
        })
    }

    render() {
        return (
            <div>
                <div>
                {this.state.items.map((items) => {
                    return (
                        <div key={items.id} >
                            <Card style={{width: '300px',}}>
                                <CardContent
                                    style={{color: 'white', background: 'black'}}>{items.category}</CardContent>
                                <CardContent>{items.serialNo} {items.items}</CardContent>
                            </Card>
                        </div>
                    )
                })}
            </div>
            </div>
        )
    }
}

export default Items;