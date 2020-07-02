import store from "../store/index";
import {inquire} from "../api/merchantsPurseApi";

setInterval(function () {
    inquire().then(res=>{
        store.state.balance = res.data
    }).catch(() => {});
}, 20000);