function getData() {
    let value = document.getElementById('leftInput').value;

    if (value) {
        document.getElementById("loader1").style.display = "block";
        document.getElementById("loader2").style.display = "block";
        $.ajax({
            type: 'POST',
            url: "http://192.168.101.8:1993/nmt_service",
            contentType: 'application/json',
            data: JSON.stringify({
                'data': value
            }),
            success: function (result) {
                document.getElementById('rightInput').value = JSON.parse(result).DATA;
                document.getElementById("loader1").style.display = "none";
                document.getElementById("loader2").style.display = "none";
            }
        });
    } else {
        alert("Enter Text!");
    }
}

function clearData() {
    document.getElementById('leftInput').value = "";
    document.getElementById('rightInput').value = "";
}



function selectFile() {
    $('#file-input').trigger('click');
    readFile();
};


function readFile() {
    var fileInput = document.getElementById('file-input');

    fileInput.addEventListener('change', function (e) {
        let file = fileInput.files[0];
        let reader = new FileReader();
        document.getElementById('fileName').innerHTML = file.name;
        reader.readAsDataURL(file);
        document.getElementById("loader1").style.display = "block";
        document.getElementById("loader2").style.display = "block";

        reader.onload = function () {
//            console.log(reader.result);
            var formData = new FormData();
            formData.append("data", file);
            $.ajax({
                "async": true,
                "crossDomain": true,
                "url": "http://192.168.101.7:1993/process_word",
                "method": "POST",
                "contentType": false,
                "cache": false,
                "processData": false,
                "data": formData,
                xhrFields:{
                responseType: 'blob'
            },
                success: function (result,status,xhr) {
                console.log("name of file",xhr.getResponseHeader("filename_flask"))
                console.log("name of file type",xhr.getResponseHeader("content-type"))
                    var file_type_rec=xhr.getResponseHeader("content-type")
                    downloadFile(xhr.getResponseHeader("filename_flask"),result,file_type_rec)
                    document.getElementById("loader1").style.display = "none";
                    document.getElementById("loader2").style.display = "none";
                }
            });
        };
        reader.onerror = function () {
            console.log(reader.error);
        };
    });
}


function downloadFile(fileName,  data_rec,file_type_rec) {
    var blob = new Blob([data_rec], {type: file_type_rec});
    var url= window.URL.createObjectURL(blob)
    var link = document.createElement('a');
        document.body.appendChild(link);
        link.style = "display: none";
        link.href = url;
        link.download = fileName;
        link.click();
    setTimeout(()=>{window.URL.revokeObjectURL(url)
    link.remove();},50)

}
