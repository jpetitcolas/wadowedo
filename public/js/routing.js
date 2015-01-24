function displayFileIn(url, div, cb) {
    $.ajax({
        url: url,
        success: function( data ) {
            div.html(data);

            if (cb) {
                cb();
            }
        }
    });
}
