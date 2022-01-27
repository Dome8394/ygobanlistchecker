exports.landing_page = (req, res) => {
    res.render('index', {
        current_banlist_date: currentDate,
        forbidden: forbidden,
        limited: limited,
        semiLimited: semiLimited,
        unlimited: unlimited
    } )
}