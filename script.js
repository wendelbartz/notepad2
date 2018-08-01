$(function() {
    if (localStorage.notepad != undefined && localStorage.notepad != "[]"){
        var i = 1;
        var j = 0;
        var linha = 2;
        var notas = JSON.parse(localStorage.getItem('notepad'));
        var next;

        $('tr:last > td[info="nome"]').html(notas[0][0]);
        $('tr:last > td[info="nota1"]').html(notas[0][1]);
        $('tr:last > td[info="nota2"]').html(notas[0][2]);
        $('tr:last > td[info="nota3"]').html(notas[0][3]);
        $('tr:last > td[info="nota4"]').html(notas[0][4]);
        while (notas.length > i) {
            next = $('<tr linha="' + linha + '"></tr>');
            next.append('<td info="nome">'+notas[i][j++]+'</td>');
            next.append('<td info="nota1">'+notas[i][j++]+'</td>');
            next.append('<td info="nota2">'+notas[i][j++]+'</td>');
            next.append('<td info="nota3">'+notas[i][j++]+'</td>');
            next.append('<td info="nota4">'+notas[i++][j++]+'</td>');
            next.append('<td info="falta">---</td>');
            next.append('<td info="exame">---</td>');
            $('table').append(next);
            j = 0;
            linha++;
        };
        addLinha();
        preencheTab();
    };

    $(document).keypress(function(e) {
        if (e.which == 13 && e.target.nodeName == 'INPUT') {
            e.target.blur();
        }
    });

    $('body').on('dblclick', 'td', function() {
        if ($(this).attr('info') == 'nome' && $(this).children().prop('tagName') != 'INPUT') {
            if ($(this).html() != '---')
                $(this).html('<input type="text" class="form-control" value="' + $(this).html() + '">');
            else
                $(this).html('<input type="text" class="form-control">');
            $(this).children().focus();
        };
    });

    $('body').on('dblclick', 'td', function() {
        if ($(this).attr('info') != 'nome' && $(this).attr('info') != 'exame' && $(this).attr('info') != 'falta' && $(this).children().prop('tagName') != 'INPUT') {
            if ($(this).html() != '---')
                $(this).html('<input type="number" class="form-control" value="' + $(this).html() + '">');
            else
                $(this).html('<input type="number" class="form-control">');
            $(this).children().focus();
        };
    });

    $('body').on('blur', 'td', function() {
        if ($(this).attr('info') != 'nome' && ($(this).children().val() == '' || $(this).children().val() == '---')) {
            $(this).html('---');
            preencheTab();
            return
        }

        if ($(this).children().val() == '' || $(this).children().val() == '---') {
            if ($('tr:last').attr('linha') != 1 && ($('tr:last').children().first().html() == '---' || $('tr:last').children().first().html() == '---')) {
                if (parseInt(($(this).parent().attr('linha'))) > 0) {
                    $(this).parent().remove();
                    var linha = 1;
                    $('table tr').each(function() {
                        if (parseInt($(this).attr('linha')) > 0)
                            $(this).attr('linha', linha++);
                    });
                    preencheTab();
                    return
                }
            }
            $(this).html('---');

        } else {
            $(this).html($(this).children().val());
            if ($('tr:last > td[info="nome"]').html() != '---')
                addLinha();
        }
        preencheTab()
    });
});

function addLinha() {
    var linha = $('table tr').length - 1;
    $('table').html($('table').html() +
        `<tr linha="` + linha + `">
    <td info="nome">---</td>
    <td info="nota1">---</td>
    <td info="nota2">---</td>
    <td info="nota3">---</td>
    <td info="nota4">---</td>
    <td info="falta">---</td>
    <td info="exame">---</td>
  </tr>`);
};

function preencheTab() {
    $('tr[linha]').each(function() {
        if ($(this).children().first().html() != '---') {
            $('tr[linha="' + linha + '"] > td[info="falta"]').html('---');
            $('tr[linha="' + linha + '"] > td[info="exame"]').html('---');
            var linha = $(this).attr('linha');
            var soma = 0;
            if (isNaN(parseInt($(this).children().first().next().html())) != true)
                soma += parseFloat($(this).children().first().next().html());
            if (isNaN(parseInt($(this).children().first().next().next().html())) != true)
                soma += parseFloat($(this).children().first().next().next().html());
            if (isNaN(parseInt($(this).children().first().next().next().next().html())) != true)
                soma += parseFloat($(this).children().first().next().next().next().html());
            if (isNaN(parseInt($(this).children().first().next().next().next().next().html())) != true)
                soma += parseFloat($(this).children().first().next().next().next().next().html());
            $('tr[linha="' + linha + '"] > td[info="falta"]').html(28 - soma > 0 ? Math.round((28 - soma) * 10) / 10 : 0);
            $('tr[linha="' + linha + '"] > td[info="exame"]').html(28 - soma > 0 ? Math.ceil(((5 - (soma / 4 * 0.6)) / 0.4) * 10) / 10 : '---');
        }
    });
    var global = []
    $('tr[linha]').each(function() {
        localStorage.clear();
        var i = 0;
        var nota = $(this).children();
        var fix = [];
        while (5 > i) {
            if (nota[i].innerHTML == '---' && nota[i].getAttribute('info') == 'nome')
                break;
            fix[fix.length] = nota[i].innerHTML;
            i++
        }
        if (fix.length > 2)
            global[global.length] = fix
    });
    localStorage.setItem('notepad', JSON.stringify(global));
};
