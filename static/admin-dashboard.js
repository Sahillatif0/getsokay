setTimeout(() => {
    const baltexts = document.querySelectorAll(`.balance`);
    const speed = 200;
    baltexts.forEach(baltext => {
    function updatebalance() {
        let target = +baltext.getAttribute("data-target");
        const unit = baltext.getAttribute("unit");
        const current = +baltext.innerText;
        let inc = target/speed;
        if (inc<0.009){
            inc *=10;
        }
        if (current<target){
            let bal = (current+inc);
            baltext.innerText = (bal).toFixed(3);
            setTimeout(updatebalance, 10);
        }
        else{
            let points = unit=="Users"?0:2;
            if (target>99){
                target = points===2?target.toFixed(1):target;
                baltext.innerText = `${target} ${unit}`;
            }
            else{
            target = points===2?target.toFixed(2):target;
                baltext.innerText = `${target} ${unit}`;

            }
        }
    }
    updatebalance();
});
}, 1);

