//검색바 메뉴 활성화
$('#searchActive').click(function()
{
    if(!$('.searchHead').hasClass('active'))
    {
        $('.searchHead').addClass('active');
    }
});

//검색바 비활성화
$('#searchCloseBtn').click(function()
{
    $('.searchHead').removeClass('active')
});

//햄버거 메뉴 활성화 및 닫기
$('#menuActive').click(function()
{
    var header = $('.mainHeader');
    if(!header.hasClass('menuOn'))
    {
        $('.mainHeader').addClass('menuOn');
    }
    else
    {
        $('.mainHeader').removeClass('menuOn');
    }
});