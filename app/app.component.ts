import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgZone } from '@angular/core';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';
import * as cornerstoneMath from 'cornerstone-math';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import $ from '../../node_modules/jquery/dist/jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./cornerstone.min.css']
})
export class AppComponent {
  title = 'app';
  public listEfects: any;
  @ViewChild('someVar') el: ElementRef;

  public image108Base64: string;
  public image109Base64: string;
  public image1PixelData: any;
  public image2PixelData: any;
  public itens: any[];
  public uri: string;

  @ViewChild('tool') myTool;
  @ViewChild('action') action;
  constructor(private render: Renderer2, elementRef: ElementRef, private zone: NgZone) {
    this.uri = "";
    this.listEfects = cornerstone.colors.getColormapsList();
    this.itens = [
      { "id": "wwwc", "name": "WW/WC" },
      { "id": "pan", "name": "Pan" },
      { "id": "zoom", "name": "Zoom" },
      { "id": "length", "name": "Length" },
      { "id": "probe", "name": "Probe" },
      { "id": "ellipticalRoi", "name": "Elliptical ROI" },
      { "id": "rectangleRoi", "name": "Rectangle ROI" },
      { "id": "angle", "name": "Angle" },
      { "id": "highlight", "name": "HighLigth" },
      { "id": "freehand", "name": "Freehand" }
    ]

    var config = {
      webWorkerPath: './../assets/cornerstoneWADOImageLoaderWebWorker.js',
      taskConfiguration: {
        'decodeTask': {
          codecsPath: './cornerstoneWADOImageLoaderCodecs.js'
        }
      }
    };
    cornerstoneWADOImageLoader.webWorkerManager.initialize(config);

  }

  public setListToolsByDevice() {
    this.itens = [
      { "id": "wwwcTouchDrag", "name": "WW/WC" },
      { "id": "panTouchDrag", "name": "Pan" },
      { "id": "rotateTouchDrag", "name": "Rotate" },
      { "id": "zoomTouchPinch", "name": "Zoom" },
      { "id": "lengthTouch", "name": "Length" },
      { "id": "probeTouch", "name": "Probe" },
      { "id": "ellipticalRoiTouch", "name": "Elliptical ROI" },
      { "id": "rectangleRoiTouch", "name": "Rectangle ROI" },
      { "id": "angleTouch", "name": "Angle" }
    ]
  }

  public sout(a){
    let url = "wadouri:" + a.target.value;
    cornerstoneWADOImageLoader.wadouri.dataSetCacheManager.load(a.target.value);
    this.getExampleImage(url)
    console.log(a.target.value)
  }

  public fileUpload(event) {
    let file = event.target.files[0];
    var reader = new FileReader();
    var imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);

    this.getExampleImage(imageId);
  }

  public setModalityLut() {

    const element = document.getElementById('dicomImage');
    var applyModalityLUT = $('#toggleModalityLUT').is(":checked");
    console.log('applyModalityLUT=', applyModalityLUT);
    var image = cornerstone.getImage(element);
    var viewport = cornerstone.getViewport(element);
    if (applyModalityLUT) {
      viewport.modalityLUT = image.modalityLUT;
    } else {
      viewport.modalityLUT = undefined;
    }
    cornerstone.setViewport(element, viewport);
  }

  public setVoiLut(){
    const element = document.getElementById('dicomImage');
    var applyVOILUT = $('#toggleVOILUT').is(":checked");
    console.log('applyVOILUT=', applyVOILUT);
    var image = cornerstone.getImage(element);
    var viewport = cornerstone.getViewport(element);
    if (applyVOILUT) {
      viewport.voiLUT = image.voiLUT;
    } else {
      viewport.voiLUT = undefined;
    }
    cornerstone.setViewport(element, viewport);
  }

  public getExampleImage(imageId) {
    try {
    let self = this;
    const element = document.getElementById('dicomImage');
    cornerstone.enable(element);
    cornerstone.loadAndCacheImage(imageId).then(function (image) {
      var viewport = cornerstone.getDefaultViewportForImage(element, image);
      cornerstone.displayImage(element, image, viewport);

      cornerstoneTools.touchInput.enable(element);

      // Enable all tools we want to use with this element
      cornerstoneTools.zoomTouchPinch.activate(element);
      //cornerstoneTools.rotateTouch.activate(element);
      cornerstoneTools.wwwcTouchDrag.activate(element);
      cornerstoneTools.panMultiTouch.activate(element);

      cornerstoneTools.mouseInput.enable(element);
      cornerstoneTools.mouseWheelInput.enable(element);
      // Enable all tools we want to use with this element
      cornerstoneTools.wwwc.activate(element, 1); // ww/wc is the default tool for left mouse button
      cornerstoneTools.pan.activate(element, 2); // pan is the default tool for middle mouse button
      cornerstoneTools.zoom.activate(element, 4); // zoom is the default tool for right mouse button
      cornerstoneTools.zoomWheel.activate(element); // zoom is the default tool for middle mouse wheel
      cornerstoneTools.probe.enable(element);
      cornerstoneTools.length.enable(element);
      cornerstoneTools.ellipticalRoi.enable(element);
      cornerstoneTools.rectangleRoi.enable(element);
      cornerstoneTools.angle.enable(element);
      cornerstoneTools.highlight.enable(element);

      function disableAllTools() {
        cornerstoneTools.wwwc.disable(element);
        cornerstoneTools.pan.activate(element, 2); // 2 is middle mouse button
        cornerstoneTools.zoom.activate(element, 4); // 4 is right mouse button
        cornerstoneTools.probe.deactivate(element, 1);
        cornerstoneTools.length.deactivate(element, 1);
        cornerstoneTools.ellipticalRoi.deactivate(element, 1);
        cornerstoneTools.rectangleRoi.deactivate(element, 1);
        cornerstoneTools.angle.deactivate(element, 1);
        cornerstoneTools.highlight.deactivate(element, 1);
        cornerstoneTools.freehand.deactivate(element, 1);
      }

      self.render.listen(self.myTool.nativeElement, 'click', (evt) => {
        disableAllTools();
        cornerstoneTools[evt.target.id].activate(element, 1);
      })

      self.render.listen(self.action.nativeElement, 'click', (event) => {
        cornerstoneTools.saveAs(element, event.target.id);
        return false;
      })

      function onViewportUpdated(e) {
        var viewport = cornerstone.getViewport(e.target)
      };

      $(element).on("CornerstoneImageRendered", onViewportUpdated);

      var config = {
        minScale: 0.25,
        maxScale: 20.0,
        preventZoomOutsideImage: true
      };

      cornerstoneTools.zoom.setConfiguration(config);

      $('#chkshadow').on('change', function () {
        cornerstoneTools.length.setConfiguration({ shadow: this.checked });
        cornerstoneTools.angle.setConfiguration({ shadow: this.checked });
        cornerstone.updateImage(element);
      });

    })
    } catch (err) {
      console.log(err)
    }
  }

  public changeEfect(efect) {
    const element = document.getElementById('dicomImage');
    let image = cornerstone.getEnabledElement(element).image;
    image.cachedLut = undefined;
    image.render = undefined;

    let colormap = cornerstone.colors.getColormap(efect);

    this.zone.run(()=>{console.log("roda bosta")});
    cornerstone.convertToFalseColorImage(element, colormap);
    cornerstone.updateImage(element, true);
  }

  public disableAllTools() {
    const element = document.getElementById('dicomImage');
    cornerstoneTools.wwwc.disable(element);
    cornerstoneTools.pan.activate(element, 2); // 2 is middle mouse button
    cornerstoneTools.zoom.activate(element, 4); // 4 is right mouse button
    cornerstoneTools.probe.deactivate(element, 1);
    cornerstoneTools.length.deactivate(element, 1);
    cornerstoneTools.ellipticalRoi.deactivate(element, 1);
    cornerstoneTools.rectangleRoi.deactivate(element, 1);
    cornerstoneTools.angle.deactivate(element, 1);
    cornerstoneTools.highlight.deactivate(element, 1);
    cornerstoneTools.freehand.deactivate(element, 1);
  }

}
