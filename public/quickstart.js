$(function () {
  const speakerDevices = document.getElementById('speaker-devices');
  const ringtoneDevices = document.getElementById('ringtone-devices');
  const outputVolumeBar = document.getElementById('output-volume');
  const inputVolumeBar = document.getElementById('input-volume');
  const volumeIndicators = document.getElementById('volume-indicators');
  const callButton = document.getElementById('button-call');
  const hangupButton = document.getElementById('button-hangup');
  const callControlsDiv = document.getElementById('call-controls');
  const audioSelectionDiv = document.getElementById('output-selection');
  const getDevicesButton = document.getElementById('get-devices');
  const logDiv = document.getElementById("log");
  const incomingCallDiv = document.getElementById("incoming-call");

  const incomingCallHangupButton = document.getElementById("button-hangup-incoming");
  const incomingCallAcceptButton = document.getElementById("button-accept-incoming");
  const incomingCallRejectButton = document.getElementById("button-reject-incoming");


  


  var device;
  let token;


  log('Requesting Capability Token...');
  $.getJSON('/token')
    .then(function (data) {
      log('Got a token.');
      token = data.token;
      console.log('Token: ' + token);
      setClientNameUI(data.identity);  
    })
    .then(() => {
      document.getElementById('startup-button').addEventListener('click', intitializeDevice)
    })
  .catch(function (err) {
    console.log(err);
    log("An error occurred. See your browser console for more information.");
  });


  function addDeviceListeners(device) {

    device.on("registered", function() {
      log("Twilio.Device Ready to make and receive calls!");
      callControlsDiv.style.display = "block";
    });
    
    device.on("error", function(error) {
      log("Twilio.Device Error: " + error.message);
    });
    
    device.on("incoming", (call) => {
      setupIncomingCallUI(call)

    });
        
    device.audio.on("deviceChange", updateAllDevices.bind(device));
    
    // Show audio selection UI if it is supported by the browser.
    if (device.audio.isOutputSelectionSupported) {
      audioSelectionDiv.style.display = "block";
    }
  }
  
  function intitializeDevice() {
    log("Initializing device")
    device = new Twilio.Device(token, {
      debug: true, 
      // Set Opus as our preferred codec. Opus generally performs better, requiring less bandwidth and
      // providing better audio quality in restrained network conditions. Opus will be default in 2.0.
      codecPreferences: ["opus", "pcmu"]
      // Use fake DTMF tones client-side. Real tones are still sent to the other end of the call,
      // but the client-side DTMF tones are fake. This prevents the local mic capturing the DTMF tone
      // a second time and sending the tone twice.
    })

    addDeviceListeners(device);
    device.register();
  }

  // Bind button to make call
  callButton.onclick = function() {

    // get the phone number to call from the DOM
    var params = {
      To: document.getElementById("phone-number").value
    };

    console.log("Calling " + params.To + "...");
    if (device) {
      log('Attempting to connect')
      console.log(params)
      device.connect({ params }).then((call) => handleEstablishedCall(call))
    } else {
      log("Device not initialized")
    }
  };

  getDevicesButton.onclick = function() {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(updateAllDevices.bind(device));
  };

  speakerDevices.addEventListener("change", function() {
    var selectedDevices = [].slice
      .call(speakerDevices.children)
      .filter(function(node) {
        return node.selected;
      })
      .map(function(node) {
        return node.getAttribute("data-id");
      });

    device.audio.speakerDevices.set(selectedDevices);
  });

  ringtoneDevices.addEventListener("change", function() {
    var selectedDevices = [].slice
      .call(ringtoneDevices.children)
      .filter(function(node) {
        return node.selected;
      })
      .map(function(node) {
        return node.getAttribute("data-id");
      });

    device.audio.ringtoneDevices.set(selectedDevices);
  });

  function bindVolumeIndicators(connection) {
    connection.on("volume", function(inputVolume, outputVolume) {
      var inputColor = "red";
      if (inputVolume < 0.5) {
        inputColor = "green";
      } else if (inputVolume < 0.75) {
        inputColor = "yellow";
      }

      inputVolumeBar.style.width = Math.floor(inputVolume * 300) + "px";
      inputVolumeBar.style.background = inputColor;

      var outputColor = "red";
      if (outputVolume < 0.5) {
        outputColor = "green";
      } else if (outputVolume < 0.75) {
        outputColor = "yellow";
      }

      outputVolumeBar.style.width = Math.floor(outputVolume * 300) + "px";
      outputVolumeBar.style.background = outputColor;
    });
  }

  function updateAllDevices() {
    updateDevices(speakerDevices, device.audio.speakerDevices.get());
    updateDevices(ringtoneDevices, device.audio.ringtoneDevices.get());
  }

  function handleEstablishedCall (call) {

    call.addListener("accept", handleAcceptedCall);
    
    call.addListener("disconnect", handleDisconnectedCall);

    hangupButton.onclick = (call) => {
      log('Hanging up ...');
      if (device) {
        device.disconnectAll();
      }
    }
  }

  // "accepted" means the call has finished connecting and the state is now "open"
  function handleAcceptedCall(call) {
    log("Call in progress ...")
    callButton.style.display = "none";
    hangupButton.style.display = "inline";
    volumeIndicators.style.display = "block";
    bindVolumeIndicators(call);
  }

//TODO: refactor these show/hide things with a css class disabling them

  function handleDisconnectedCall() {
    log("Call disconnected.");
    callButton.style.display = "inline";
    hangupButton.style.display = "none";
    volumeIndicators.style.display = "none";
  }

  // Update the available ringtone and speaker devices
  function updateDevices(selectEl, selectedDevices) {
    selectEl.innerHTML = "";

    device.audio.availableOutputDevices.forEach(function(device, id) {
      var isActive = selectedDevices.size === 0 && id === "default";
      selectedDevices.forEach(function(device) {
        if (device.deviceId === id) {
          isActive = true;
        }
      });

      var option = document.createElement("option");
      option.label = device.label;
      option.setAttribute("data-id", id);
      if (isActive) {
        option.setAttribute("selected", "selected");
      }
      selectEl.appendChild(option);
    });
  }

  // Activity log
  function log(message) {
    logDiv.innerHTML += "<p>&gt;&nbsp;" + message + "</p>";
    logDiv.scrollTop = logDiv.scrollHeight;
  }

  // Set the client name in the UI
  function setClientNameUI(clientName) {
    var div = document.getElementById("client-name");
    div.innerHTML = "Your client name: <strong>" + clientName + "</strong>";
  }

  function acceptIncomingCall(call) {
    call.accept();
    log('Accepted incoming call.');
    incomingCallHangupButton.style.display = "inline";
    incomingCallAcceptButton.style.display = "none";
    incomingCallRejectButton.style.display = "none";
  }

  function resetIncomingCallUI () {
    document.getElementById("incoming-number").innerHTML = "";
    document.getElementById("incoming-call").style.display = "none";
  }

  function rejectIncomingCall(call) {
    call.reject();
    log("Rejected incoming call");
    resetIncomingCallUI();
  }

  function hangupIncomingCall(call) {
    call.disconnectAll();
    log("Hung up incoming call.");
    resetIncomingCallUI();
  }

  // Update UI when an incoming call comes in
  function setupIncomingCallUI(call) {
    log(`Incoming call from ${call.parameters.From}`)

    incomingCallDiv.style.display = "block";
    document.getElementById("incoming-number").innerHTML = call.parameters.From;
    incomingCallAcceptButton.style.display = "inline";
    incomingCallRejectButton.style.display = "inline";
    incomingCallHangupButton.style.display = "none";

    incomingCallAcceptButton.onclick = () => {
      acceptIncomingCall(call);
    }

    incomingCallRejectButton.onclick = () => {
      rejectIncomingCall(call);
    }

    incomingCallHangupButton.onclick = () => {
      hangupIncomingCall(call);
    }

    call.addListener('cancel', handleDisconnectedIncomingCall)
  }
});
