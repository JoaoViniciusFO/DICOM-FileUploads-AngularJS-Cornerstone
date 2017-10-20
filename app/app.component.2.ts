import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';
import * as cornerstoneMath from 'cornerstone-math';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as $ from 'jquery';
import * as dicomParser from 'dicom-parser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./cornerstone.min.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  public listEfects: any;
  @ViewChild('someVar') el: ElementRef;

  public image108Base64: string;
  public image109Base64: string;
  public image1PixelData: any;
  public image2PixelData: any;
  public itens: any[];
  public cornerstoneFileImageLoader: any;
  public files: any;

  @ViewChild('tool') myTool;
  @ViewChild('action') action;
  constructor(private render: Renderer2, elementRef: ElementRef) {
    this.cornerstoneFileImageLoader = {};
    this.files = [];
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

  // public getExampleImage(imageId) {
  //   let self = this;
  //   const element = document.getElementById('dicomImage');
  //   cornerstone.enable(element);
  //   cornerstone.loadImage(imageId).then(function (image) {
  //     var viewport = cornerstone.getDefaultViewportForImage(element, image);
  //     cornerstone.displayImage(element, image, viewport);

  //     cornerstoneTools.touchInput.enable(element);

  //     // Enable all tools we want to use with this element
  //     cornerstoneTools.zoomTouchPinch.activate(element);
  //     //cornerstoneTools.rotateTouch.activate(element);
  //     cornerstoneTools.wwwcTouchDrag.activate(element);
  //     cornerstoneTools.panMultiTouch.activate(element);

  //     cornerstoneTools.mouseInput.enable(element);
  //     cornerstoneTools.mouseWheelInput.enable(element);
  //     // Enable all tools we want to use with this element
  //     cornerstoneTools.wwwc.activate(element, 1); // ww/wc is the default tool for left mouse button
  //     cornerstoneTools.pan.activate(element, 2); // pan is the default tool for middle mouse button
  //     cornerstoneTools.zoom.activate(element, 4); // zoom is the default tool for right mouse button
  //     cornerstoneTools.zoomWheel.activate(element); // zoom is the default tool for middle mouse wheel
  //     cornerstoneTools.probe.enable(element);
  //     cornerstoneTools.length.enable(element);
  //     cornerstoneTools.ellipticalRoi.enable(element);
  //     cornerstoneTools.rectangleRoi.enable(element);
  //     cornerstoneTools.angle.enable(element);
  //     cornerstoneTools.highlight.enable(element);

  //     function disableAllTools() {
  //       cornerstoneTools.wwwc.disable(element);
  //       cornerstoneTools.pan.activate(element, 2); // 2 is middle mouse button
  //       cornerstoneTools.zoom.activate(element, 4); // 4 is right mouse button
  //       cornerstoneTools.probe.deactivate(element, 1);
  //       cornerstoneTools.length.deactivate(element, 1);
  //       cornerstoneTools.ellipticalRoi.deactivate(element, 1);
  //       cornerstoneTools.rectangleRoi.deactivate(element, 1);
  //       cornerstoneTools.angle.deactivate(element, 1);
  //       cornerstoneTools.highlight.deactivate(element, 1);
  //       cornerstoneTools.freehand.deactivate(element, 1);
  //     }

  //     self.render.listen(self.myTool.nativeElement, 'click', (evt) => {
  //       disableAllTools();
  //       cornerstoneTools[evt.target.id].activate(element, 1);
  //     })

  //     self.render.listen(self.action.nativeElement, 'click', (event) => {
  //       cornerstoneTools.saveAs(element, event.target.id);
  //       return false;
  //     })


  //     function onViewportUpdated(e) {
  //       var viewport = cornerstone.getViewport(e.target)
  //     };

  //     $(element).on("CornerstoneImageRendered", onViewportUpdated);

  //     var config = {
  //       // invert: true,
  //       minScale: 0.25,
  //       maxScale: 20.0,
  //       preventZoomOutsideImage: true
  //     };

  //     cornerstoneTools.zoom.setConfiguration(config);

  //     $('#chkshadow').on('change', function () {
  //       cornerstoneTools.length.setConfiguration({ shadow: this.checked });
  //       cornerstoneTools.angle.setConfiguration({ shadow: this.checked });
  //       cornerstone.updateImage(element);
  //     });

  //   })
  // }

  // public changeEfect(efect) {
  //   const element = document.getElementById('dicomImage');
  //   let image = cornerstone.getEnabledElement(element).image;
  //   let minPixelValue = image.minPixelValue || 0;
  //   let maxPixelValue = image.maxPixelValue || 255;

  //   let colormap = cornerstone.colors.getColormap(efect);

  //   console.log(colormap);


  //   cornerstone.convertToFalseColorImage(element, colormap);
  //   cornerstone.updateImage(element, true);
  // }

  // public disableAllTools() {
  //   const element = document.getElementById('dicomImage');
  //   cornerstoneTools.wwwc.disable(element);
  //   cornerstoneTools.pan.activate(element, 2); // 2 is middle mouse button
  //   cornerstoneTools.zoom.activate(element, 4); // 4 is right mouse button
  //   cornerstoneTools.probe.deactivate(element, 1);
  //   cornerstoneTools.length.deactivate(element, 1);
  //   cornerstoneTools.ellipticalRoi.deactivate(element, 1);
  //   cornerstoneTools.rectangleRoi.deactivate(element, 1);
  //   cornerstoneTools.angle.deactivate(element, 1);
  //   cornerstoneTools.highlight.deactivate(element, 1);
  //   cornerstoneTools.freehand.deactivate(element, 1);
  // }

  public fileUpload(event) {
    let file = event.target.files[0];
    let index = this.addFile(file);

    var imageId = "dicomfile://" + index;
    // load and display this image into the element
    var element = $('#dicomImage').get(0);
    cornerstone.loadImage(imageId).then(function (image) {
      cornerstone.displayImage(element, image);
    }, function(err){console.log(err)});

  }

  public getFile(index) {
    console.log(this.files[index]);
    
    return this.files[index];
  }

  public addFile(file) {
    let fileIndex = this.files.push(file);
    return fileIndex - 1;
  }

  public purge() {
    this.files = [];
  }

  ngOnInit() {
    const self = this;
    if (this.cornerstoneFileImageLoader === undefined) {
      this.cornerstoneFileImageLoader = {};
    }

    function isColorImage(photoMetricInterpretation) {
      if (photoMetricInterpretation === "RGB" ||
        photoMetricInterpretation === "PALETTE COLOR" ||
        photoMetricInterpretation === "YBR_FULL" ||
        photoMetricInterpretation === "YBR_FULL_422" ||
        photoMetricInterpretation === "YBR_PARTIAL_422" ||
        photoMetricInterpretation === "YBR_PARTIAL_420" ||
        photoMetricInterpretation === "YBR_RCT") {
        return true;
      }
      else {
        return false;
      }
    }

    
    function createImageObject(dataSet, imageId, frame) {
      if (frame === undefined) {
        frame = 0;
      }

      // make the image based on whether it is color or not
      var photometricInterpretation = dataSet.string('x00280004');
      var isColor = isColorImage(photometricInterpretation);
      if (isColor === false) {
        return cornerstoneWADOImageLoader.makeGrayscaleImage(imageId, dataSet, dataSet.byteArray, photometricInterpretation, frame);
      } else {
        return cornerstoneWADOImageLoader.makeColorImage(imageId, dataSet, dataSet.byteArray, photometricInterpretation, frame);
      }
    }

    var multiFrameCacheHack = {};
    function loadImage(imageId) {
      
      var deferred = $.Deferred();
      var url = imageId;
      url = url.substring(12);
      var frameIndex = url.indexOf('frame=');
      var frame;
      if (frameIndex !== -1) {
        var frameStr = url.substr(frameIndex + 6);
        frame = parseInt(frameStr);
        url = url.substr(0, frameIndex - 1);
      }

      if (frame !== undefined &&
        multiFrameCacheHack.hasOwnProperty(url)) {
        var dataSet = multiFrameCacheHack[url];
        var imagePromise = createImageObject(dataSet, imageId, frame);
        imagePromise.then(function (image) {
          deferred.resolve(image);
        }, function () {
          deferred.reject();
        });
        return deferred;
      }

      var fileIndex = parseInt(url);
      
      var file = self.getFile(fileIndex);
      if (file === undefined) {
        deferred.reject('unknown file index ' + url);
        return deferred;
      }

      var fileReader = new FileReader();
      fileReader.onloadend = function () {
        var dicomPart10AsArrayBuffer = fileReader.result;
        var byteArray = new Uint8Array(dicomPart10AsArrayBuffer);
        var dataSet = dicomParser.parseDicom(byteArray);

        if (frame !== undefined) {
          multiFrameCacheHack[url] = dataSet;
        }

        var imagePromise = createImageObject(dataSet, imageId, frame);
        imagePromise.then(function (image) {
          deferred.resolve(image);
        }, function () {
          deferred.reject();
        });
      };
      fileReader.readAsArrayBuffer(file);

      return deferred;
    }
    cornerstone.registerImageLoader('dicomfile', loadImage);
  }

}
