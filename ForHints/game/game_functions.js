function game_forward_msg(id,listid) {

  getWindow('WndMessage').show('type=forward&id='+id+'&listid='+listid);
}

function game_reply_msg(id,listid) {

  getWindow('WndMessage').show('type=reply&id='+id+'&listid='+listid);
}


function fleet_external_comand(cmd,param,method){

}