<script lang="ts">
    const birthday = new Date("1997-03-09");

    function fullYearsBetween(date1: Date, date2: Date): number {
        let years = date2.getFullYear() - date1.getFullYear();
        const monthDiff = date2.getMonth() - date1.getMonth();
        const dayDiff = date2.getDate() - date1.getDate();
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            years--;
        }
        return years;
    }

    const age = fullYearsBetween(birthday, new Date());
</script>

{age}
