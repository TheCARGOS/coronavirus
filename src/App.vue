<template>
    <div>
        <table>
            <tr>
                <th>FECHA</th>
                <th>CONFIRMADOS ACUMULADOS</th>
                <th>FACTOR DE CONTAGIO</th>
            </tr>

            <tr v-for="(date, index) in dates" :key="index">
                <td >{{date}}</td>
                <td> {{isInfected[index]}} </td>
            </tr>
        </table>
    </div>
</template>

<script>
export default {
    data () {
        return {
            dates: [
                "6 de marzo",
                "7 de marzo",
                "8 de marzo",
                "9 de marzo",
                "10 de marzo",
                "11 de marzo",
                "12 de marzo",
                "13 de marzo",
                "14 de marzo",
                "15 de marzo",
                "16 de marzo",
                "17 de marzo",
                "18 de marzo",
                "19 de marzo",
                "20 de marzo",
                "21 de marzo",
                "22 de marzo",
                "23 de marzo",
                "24 de marzo"
            ],
            isInfected: [
                1,
                6,
                7,
                9,
                9,
                13,
                22,
                28,
                43,
                71,
                86,
                117,
                145,
                234,
                263,
                318,
                363
            ],
            riskFactor: [

            ]
        }
    }
}
</script>