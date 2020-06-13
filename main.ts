function LED制御 (slot2Value: number) {
    splitSlot2(slot2Value)
    carcotrol.setLED(Position.Left, ledLeft)
    carcotrol.setLED(Position.Right, ledRight)
}
function splitSlot2 (slot2Value: number) {
    ledLeft = logic.rshift(logic.and(slot2Value, logic.hex2number("01")), 0)
    ledRight = logic.rshift(logic.and(slot2Value, logic.hex2number("02")), 1)
}
function モーター制御 (slot0Value: number) {
    if (slot0Value == 0) {
        carcotrol.CarCtrl(CarState.Stop, 0)
    } else {
        if (logic.rshift(logic.and(slot0Value, logic.hex2number("ff00")), 8) < 128) {
            carcotrol.CarCtrl2(logic.rshift(logic.and(slot0Value, logic.hex2number("ff00")), 8) * 2, (logic.and(slot0Value, logic.hex2number("00ff")) - 128) * 2)
        } else {
            carcotrol.CarCtrl2((logic.rshift(logic.and(slot0Value, logic.hex2number("ff00")), 8) - 256) * 2, (logic.and(slot0Value, logic.hex2number("00ff")) - 128) * 2)
        }
    }
}
function joinslot1 (lineleft: number, lineright: number, distance: number) {
    slot1Value = logic.lshift(lineleft, 9) + logic.lshift(lineright, 8) + distance
}
function splitSlot3 (slot3Value: number) {
    neo5 = logic.rshift(logic.and(slot3Value, logic.hex2number("7000")), 12)
    neo4 = logic.rshift(logic.and(slot3Value, logic.hex2number("e00")), 9)
    neo3 = logic.rshift(logic.and(slot3Value, logic.hex2number("1c0")), 6)
    neo2 = logic.rshift(logic.and(slot3Value, logic.hex2number("38")), 3)
    neo1 = logic.rshift(logic.and(slot3Value, logic.hex2number("7")), 0)
}
function makeColor (color: number) {
    色 = carcotrol.rgb(logic.bittestN(color, 0) * 255, logic.bittestN(color, 1) * 255, logic.bittestN(color, 2) * 255)
}
function NEO制御 (slot3Value: number) {
    splitSlot3(MbitMore.getSharedData(SharedDataIndex.DATA3))
    makeColor(neo1)
    carcotrol.setNeoPixelColor(0, 色)
    makeColor(neo2)
    carcotrol.setNeoPixelColor(1, 色)
    makeColor(neo3)
    carcotrol.setNeoPixelColor(2, 色)
    makeColor(neo4)
    carcotrol.setNeoPixelColor(3, 色)
    makeColor(neo5)
    carcotrol.setNeoPixelColor(4, 色)
    carcotrol.show()
    if (carcotrol.getCarType() == carcotrol.car(carType.Tinybit)) {
        carcotrol.setLED(Position.Left, 色)
    }
}
let 色 = 0
let neo1 = 0
let neo2 = 0
let neo3 = 0
let neo4 = 0
let neo5 = 0
let ledRight = 0
let ledLeft = 0
let slot1Value = 0
MbitMore.startService()
pins.digitalWritePin(DigitalPin.P0, 0)
slot1Value = 0
MbitMore.setSharedData(SharedDataIndex.DATA1, slot1Value)
if (carcotrol.getCarType() == carcotrol.car(carType.Tinybit)) {
    basic.showString("T")
} else if (carcotrol.getCarType() == carcotrol.car(carType.Maqueen)) {
    basic.showString("M")
} else {
    basic.showString("U")
}
basic.forever(function () {
    モーター制御(MbitMore.getSharedData(SharedDataIndex.DATA0))
    joinslot1(carcotrol.Line_Sensor(Position.Left), carcotrol.Line_Sensor(Position.Right), carcotrol.getDistance())
    MbitMore.setSharedData(SharedDataIndex.DATA1, slot1Value)
    LED制御(MbitMore.getSharedData(SharedDataIndex.DATA2))
    NEO制御(MbitMore.getSharedData(SharedDataIndex.DATA3))
    basic.pause(10)
})
