import {SegmentedProgressBar} from './../index'
const StaffCountBar = () => {
    const datas = [ //should always be arrray and contains obj 
        //obj conts 
        {
            name : 'admin',
            color : 'red' ,
            value : 3 ,
            total : 20 ,
        }, {
             name : 'sales staff',
            color : 'green' ,
            value : 16,
            total : 20 ,
        }, {
             name : 'manager',
            color : 'blue' ,
            value : 1 ,
            total : 20 ,
        }
    ]
    return <SegmentedProgressBar label='Staff' datas={datas} />
}

export default StaffCountBar;