from app.services.retrieval_service import RetrievalService


def test_retrieval_finds_library_in_english():
    results = RetrievalService().search('Where is the library?')

    assert results
    assert results[0]['name'] == 'University Library'


def test_retrieval_finds_library_in_kiswahili():
    results = RetrievalService().search('Maktaba iko wapi?')

    assert results
    assert results[0]['name'] == 'University Library'


def test_retrieval_returns_empty_for_unknown_information():
    results = RetrievalService().search('What is the verified 2035 tuition fee?')

    assert results == []
