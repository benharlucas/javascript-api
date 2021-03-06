describe('Configuration', function() {
  describe('Qminder.setKey', function() {
    beforeEach(function() {
      if (typeof Qminder === 'undefined') {
        Qminder = this.Qminder;
      }
      if (typeof sinon === 'undefined') {
        sinon = this.sinon;
      }

      Qminder.setKey('EXAMPLE_API_KEY');
      this.requestStub = sinon.stub(Qminder.ApiBase, 'request');
      this.requestStub.onFirstCall().resolves({ data: [] });
    });

    it('sets the API key for the REST API', function() {
      expect(Qminder.ApiBase.apiKey).toBe('EXAMPLE_API_KEY');
    });

    it('allows using the REST API', function() {
      expect(() => Qminder.locations.list()).not.toThrow();
      expect(this.requestStub.called).toBeTruthy();
    });

    afterEach(function() {
      Qminder.ApiBase.request.restore();
    });
  });
});
