import { useState, useEffect, createRef } from "react";

const Operation = {
    SUM: "+",
    MINUS: "-",
    MULTIPLY: "×",
    DIVISION: "÷",
};

const Evaluate = {
    [Operation.SUM]: (a, b) => (Number.parseFloat(a) + Number.parseFloat(b)).toString(),
    [Operation.MINUS]: (a, b) => (Number.parseFloat(a) - Number.parseFloat(b)).toString(),
    [Operation.MULTIPLY]: (a, b) => (Number.parseFloat(a) * Number.parseFloat(b)).toString(),
    [Operation.DIVISION]: (a, b) => (Number.parseFloat(a) / Number.parseFloat(b)).toString(),
};

export default function App() {
    const [hasUserInterected, setHasUserInterected] = useState(false);
    const [previousOperation, setPreviousOperation] = useState("");
    const [selectedOperation, setSelectedOperation] = useState("");
    const [numOnScreen, setNumOnScreen] = useState("0");
    const [leftOprand, setLeftOprand] = useState("");
    const [priviousOprand, setPriviousOprand] = useState("");

    const left = Number.parseFloat(leftOprand);
    const right = Number.parseFloat(numOnScreen);

    useEffect(() => {
        const onKeyUp = (e) => {
            const input = Number.parseInt(e.key);

            if (!Number.isNaN(input) || e.key === ".") {
                genericKeyClickHandler(e.key);
            } else {
                switch (e.key) {
                    case "+": {
                        plus();
                        break;
                    }
                    case "-": {
                        minus();
                        break;
                    }
                    case "*": {
                        multiply();
                        break;
                    }
                    case "/": {
                        divide();
                        break;
                    }
                    case "c": {
                        reset();
                        break;
                    }
                    case "Enter": {
                        equate();
                        break;
                    }
                }
            }
        };

        window.addEventListener("keyup", onKeyUp);

        // aa kyare call thai?

        // 1. component unmount thai tyare
        // 2. deps array ni value change thai tyare pan call thai
        return () => {
            window.removeEventListener("keyup", onKeyUp);
        };
    }, [numOnScreen]);

    // This function is for to decide whether you want to append or reset a input-number
    const genericKeyClickHandler = (inputNumberKey) => {
        setHasUserInterected(true);

        if (hasUserInterected) {
            if (numOnScreen.length > 12) {
                return;
            }
            // jo aa if valo block true hse tyare j append thase aa jayre false thai jay tyare
            // aa block execute nahi thay nd pachi else valo block che j nahi atle kai execute nahi thay!
            if (!(inputNumberKey === "." && numOnScreen.includes("."))) {
                setNumOnScreen(numOnScreen + inputNumberKey);
            }
        } else {
            setNumOnScreen(inputNumberKey);
        }
    };

    const calculate = () => {
        // In this function we will set left oprand ,beacuse right Oprand will write by user

        // if you do 2 +++ or similar kind of opration this if block will execute!
        if (!numOnScreen) {
            return;
        }

        if (!selectedOperation) {
            setLeftOprand(numOnScreen);
        } else {
            const ans = Evaluate[selectedOperation](left, right);
            setLeftOprand(ans);
        }

        // this is to update the value on screen..example 2+ 3 ...so if i dont do this this woud be 23 insted of 3+
        setNumOnScreen("");
    };

    const reset = () => {
        setHasUserInterected(false);
        setPreviousOperation("");
        setSelectedOperation("");
        setNumOnScreen("0");
        setLeftOprand("");
        setPriviousOprand("");
    };

    const multiply = () => {
        setSelectedOperation(Operation.MULTIPLY);
        calculate();
    };

    const divide = () => {
        setSelectedOperation(Operation.DIVISION);
        calculate();
    };

    const minus = () => {
        setSelectedOperation(Operation.MINUS);
        calculate();
    };

    const plus = () => {
        setSelectedOperation(Operation.SUM);
        calculate();
    };

    const equate = () => {
        // This is  for => 2+3 = 5 ,so afterthat if you press any key then the number
        // will not append !
        setHasUserInterected(false);

        // Number.isNaN(left) => True => If we directly press = without any number!
        // Number.isNaN(right) => True => If we select opration and then press = without any number

        if (Number.isNaN(left) || Number.isNaN(right)) {
            // "If we press 256 + ="
            //  so left = 256 and right = NaN;
            if (!Number.isNaN(left)) {
                setNumOnScreen(left);
            } else if (!Number.isNaN(right)) {
                // if we press diresctly = without any number!
                //Example - if we press "256 = " so right is 256 and left is NaN
                setNumOnScreen(right);
            }
            return;
        }

        if (selectedOperation) {
            // we set priviousOprand and priviousOpration in this if block because
            // it will be set in next iteration! at that time selectedOpration will be empty
            // nd we can use privious values as they set before!
            const ans = Evaluate[selectedOperation](left, right);
            setPreviousOperation(selectedOperation);
            setSelectedOperation("");
            setPriviousOprand(right);
            setNumOnScreen(ans);
        } else {
            // check the previous selectedOPeration
            // selected opration = "" , 5 +3 = 8 and after that you will press = continuously
            // output will be for sum opration = 8 , 11, 14,17...and son on!
            // This will be for every Opration!
            const ans = Evaluate[previousOperation](numOnScreen, priviousOprand);
            setNumOnScreen(ans);
        }
    };

    const keys = [
        [
            {
                key: "c",
                class: "common-button c-btn",
                colSpan: 2,
                onClick: reset,
            },

            {
                key: Operation.MULTIPLY,
                class: "common-button",
                onClick: multiply,
            },
            {
                key: Operation.DIVISION,
                class: "common-button",
                onClick: divide,
            },
        ],
        [
            { key: "7", class: "common-button" },
            { key: "8", class: "common-button" },
            { key: "9", class: "common-button" },
            {
                key: Operation.MINUS,
                class: "common-button",
                onClick: minus,
            },
        ],
        [
            { key: "4", class: "common-button" },
            { key: "5", class: "common-button" },
            { key: "6", class: "common-button" },
            {
                key: Operation.SUM,
                class: "common-button",
                onClick: plus,
            },
        ],
        [
            { key: "1", class: "common-button", ref: createRef() },
            { key: "2", class: "common-button", ref: createRef() },
            { key: "3", class: "common-button" },
            {
                key: "=",
                class: "common-button equal-btn",
                rowSpan: 2,
                onClick: equate,
            },
        ],
        [
            { key: "0", colSpan: 2, class: "common-button" },
            { key: ".", class: "common-button" },
        ],
    ];

    const renderDisplay = () => {
        if (!selectedOperation) {
            return (
                <div>
                    <div className="display-container">
                        <div className="display">{numOnScreen}</div>
                    </div>
                </div>
            );
        }
        if (!numOnScreen) {
            return (
                <div>
                    <div className="display-container">
                        <div className="operation">{selectedOperation}</div>
                        <div className="display">{leftOprand}</div>
                    </div>
                </div>
            );
        }
        return (
            <div>
                <div className="display-container">
                    <div className="operation">{selectedOperation}</div>
                    <div className="display">{numOnScreen}</div>
                </div>
            </div>
        );
    };

    const renderKeys = () => {
        return (
            <div className="keys-container">
                <table className="keys-table" width="100%">
                    <tbody>{keys.map((v, i) => renderSingleRow(v, i))}</tbody>
                </table>
            </div>
        );
    };

    const renderSingleRow = (row, index) => {
        return <tr key={index}>{row.map((value, index) => renderSingleKey(value, index))}</tr>;
    };

    const renderSingleKey = (aKey, index) => {
        const onKeyClick = () => (aKey.onClick ? aKey.onClick() : genericKeyClickHandler(aKey.key));

        return (
            <td key={index} colSpan={aKey.colSpan} rowSpan={aKey.rowSpan}>
                <button className={aKey.class} onClick={onKeyClick} ref={aKey.ref}>
                    {aKey.key}
                </button>
            </td>
        );
    };

    return (
        <div className="App">
            <div className="main-container">
                <div className="calculator">
                    <div>{renderDisplay()}</div>
                    <div>{renderKeys()}</div>
                </div>
            </div>
            <div className="name-footer-zalak">
                Created with ❤️ by
                <a
                    href="https://github.com/zalak-undavia/neumorphic-calculator"
                    className="profile-link-zalak"
                    target="_blank"
                >
                    Zalak Undavia
                </a>
            </div>
        </div>
    );
}
